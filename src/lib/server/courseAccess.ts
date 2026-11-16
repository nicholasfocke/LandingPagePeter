import "server-only";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import type { AuthenticatedUser } from "@/lib/server/auth";

export type StudentProfile = {
  name: string;
  email: string;
  phone: string;
};

export type CourseAccess = {
  hasAccess: boolean;
  profile: StudentProfile;
};

type UserDoc = {
  name?: string;
  nome?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  purchasedCourse?: boolean;
  isActive?: boolean;
  courseAccess?: boolean;
};

const CACHE_TTL_MS = 60_000;
const accessCache = new Map<string, { value: CourseAccess; expiresAt: number }>();

/**
 * Regra de acesso ao curso digital (validada SEMPRE no servidor):
 *  1. `users/{uid}` com `purchasedCourse: true` (gravado pelo webhook do Stripe), ou
 *     `isActive: true` / `courseAccess: true` (liberação manual pelo administrador);
 *  2. ou um documento em `payments` com o mesmo e-mail da conta autenticada.
 *
 * Contas criadas sem passar pelo checkout (ex.: cadastro direto na API pública do
 * Firebase Auth) não recebem acesso.
 *
 * Variável de emergência: `COURSE_ACCESS_ALLOW_ALL_AUTHENTICATED=true` restaura o
 * comportamento antigo (qualquer usuário logado acessa). Use apenas temporariamente.
 */
export async function getCourseAccess(user: AuthenticatedUser): Promise<CourseAccess> {
  const cached = accessCache.get(user.uid);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const { db } = getFirebaseAdmin();
  const userSnapshot = await db.collection("users").doc(user.uid).get();
  const data = (userSnapshot.exists ? userSnapshot.data() : {}) as UserDoc;

  const email = (data.email || user.email || "").toLowerCase();
  const profile: StudentProfile = {
    name: (data.name || data.nome || data.fullName || user.name || "").trim(),
    email,
    phone: data.phone || "",
  };

  let hasAccess =
    data.purchasedCourse === true || data.isActive === true || data.courseAccess === true;

  if (!hasAccess && user.email) {
    const paymentSnapshot = await db
      .collection("payments")
      .where("email", "==", user.email)
      .limit(1)
      .get();
    hasAccess = !paymentSnapshot.empty;
  }

  if (!hasAccess && process.env.COURSE_ACCESS_ALLOW_ALL_AUTHENTICATED === "true") {
    hasAccess = true;
  }

  const value = { hasAccess, profile };
  accessCache.set(user.uid, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}
