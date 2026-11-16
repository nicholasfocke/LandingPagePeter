"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { LESSON_IDS } from "@/lib/course/catalog";
import { emptyProgress, type LessonProgress } from "@/lib/course/progress";
import { loginUrlFor } from "@/lib/safeRedirect";
import type { IconName } from "@/components/ui/Icon";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

type Profile = { name: string; email: string; phone: string };

type ProgressPatch = Partial<Pick<LessonProgress, "watchedSeconds" | "durationSeconds" | "notes" | "completed">>;

type Toast = {
  id: number;
  title: string;
  text?: string;
  icon?: IconName;
  action?: { label: string; href?: string; onClick?: () => void };
};

type StudentContextValue = {
  status: "loading" | "ready" | "error";
  user: User | null;
  profile: Profile | null;
  firstName: string;
  hasAccess: boolean;
  progressById: Record<string, LessonProgress>;
  reload: () => Promise<void>;
  /** Atualiza o estado local imediatamente e persiste no servidor. */
  saveProgress: (lessonId: string, patch: ProgressPatch, options?: { keepalive?: boolean }) => Promise<boolean>;
  /** Atualiza só o estado local (ex.: posição do vídeo entre salvamentos). */
  setLocalProgress: (lessonId: string, patch: ProgressPatch) => void;
  authorizedFetch: (input: string, init?: RequestInit) => Promise<Response>;
  notify: (toast: Omit<Toast, "id">) => void;
  signOut: () => Promise<void>;
};

const StudentContext = createContext<StudentContextValue | null>(null);

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent deve ser usado dentro de <StudentProvider>.");
  }
  return context;
}

export default function StudentProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const [status, setStatus] = useState<StudentContextValue["status"]>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [progressById, setProgressById] = useState<Record<string, LessonProgress>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const tokenRef = useRef<string>("");
  const isSigningOut = useRef(false);

  const getToken = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      return "";
    }
    const token = await currentUser.getIdToken();
    tokenRef.current = token;
    return token;
  }, []);

  const authorizedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      const token = await getToken(auth?.currentUser ?? null);
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return fetch(input, { ...init, headers, cache: "no-store" });
    },
    [getToken]
  );

  const load = useCallback(
    async (currentUser: User) => {
      const token = await getToken(currentUser);
      const response = await fetch("/api/course", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (response.status === 401) {
        throw Object.assign(new Error("unauthenticated"), { code: 401 });
      }
      if (!response.ok) {
        throw new Error("Falha ao carregar dados do aluno.");
      }

      const payload = (await response.json()) as {
        profile: Profile;
        hasAccess: boolean;
        progress: LessonProgress[];
      };

      const next: Record<string, LessonProgress> = {};
      for (const item of payload.progress ?? []) {
        if (LESSON_IDS.has(item.videoId)) {
          next[item.videoId] = { ...emptyProgress(item.videoId), ...item };
        }
      }

      setProfile({
        name: payload.profile?.name || currentUser.displayName || "",
        email: payload.profile?.email || currentUser.email || "",
        phone: payload.profile?.phone || "",
      });
      setHasAccess(Boolean(payload.hasAccess));
      setProgressById(next);
    },
    [getToken]
  );

  useEffect(() => {
    if (!auth) {
      router.replace(loginUrlFor(pathnameRef.current, "config"));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        if (!isSigningOut.current) {
          router.replace(loginUrlFor(pathnameRef.current));
        }
        return;
      }

      setUser(currentUser);
      try {
        await load(currentUser);
        setStatus("ready");
      } catch (error) {
        if ((error as { code?: number }).code === 401) {
          router.replace(loginUrlFor(pathnameRef.current, "session"));
          return;
        }
        setStatus("error");
      }
    });

    return () => unsubscribe();
  }, [load, router]);

  const reload = useCallback(async () => {
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      return;
    }
    setStatus("loading");
    try {
      await load(currentUser);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [load]);

  const setLocalProgress = useCallback((lessonId: string, patch: ProgressPatch) => {
    setProgressById((current) => ({
      ...current,
      [lessonId]: { ...(current[lessonId] ?? emptyProgress(lessonId)), ...patch, updatedAt: Date.now() },
    }));
  }, []);

  const saveProgress = useCallback(
    async (lessonId: string, patch: ProgressPatch, options: { keepalive?: boolean } = {}) => {
      setLocalProgress(lessonId, patch);

      try {
        // Em `pagehide` não há tempo para renovar o token; usamos o último válido.
        const token = options.keepalive && tokenRef.current
          ? tokenRef.current
          : await getToken(auth?.currentUser ?? null);
        if (!token) {
          return false;
        }
        const response = await fetch("/api/video-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ videoId: lessonId, ...patch }),
          keepalive: options.keepalive,
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    [getToken, setLocalProgress]
  );

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 6000);
  }, []);

  const signOut = useCallback(async () => {
    isSigningOut.current = true;
    if (auth) {
      await firebaseSignOut(auth);
    }
    router.replace("/login");
  }, [router]);

  const firstName = useMemo(() => {
    const name = profile?.name?.trim();
    if (name && !name.includes("@")) {
      return name.split(/\s+/)[0];
    }
    return "";
  }, [profile?.name]);

  const value = useMemo<StudentContextValue>(
    () => ({
      status,
      user,
      profile,
      firstName,
      hasAccess,
      progressById,
      reload,
      saveProgress,
      setLocalProgress,
      authorizedFetch,
      notify,
      signOut,
    }),
    [status, user, profile, firstName, hasAccess, progressById, reload, saveProgress, setLocalProgress, authorizedFetch, notify, signOut]
  );

  return (
    <StudentContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast" role="status">
            <span className="toast__icon" aria-hidden="true">
              <Icon name={toast.icon ?? "checkCircle"} size={18} />
            </span>
            <div className="toast__body">
              <p className="toast__title">{toast.title}</p>
              {toast.text ? <p className="toast__text">{toast.text}</p> : null}
            </div>
            {toast.action ? (
              toast.action.href ? (
                <Link className="toast__action" href={toast.action.href}>
                  {toast.action.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className="toast__action"
                  onClick={() => {
                    toast.action?.onClick?.();
                    setToasts((current) => current.filter((item) => item.id !== toast.id));
                  }}
                >
                  {toast.action.label}
                </button>
              )
            ) : null}
          </div>
        ))}
      </div>
    </StudentContext.Provider>
  );
}
