"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import "./page.css";

type UserProfile = {
  name?: string;
  email?: string;
};

export default function VideosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!auth || !db) {
      router.replace("/login?error=" + encodeURIComponent("Firebase não configurado."));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const profileRef = doc(db, "users", user.uid);
        const profileDoc = await getDoc(profileRef);

        if (!profileDoc.exists()) {
          await signOut(auth);
          router.replace("/login");
          return;
        }

        const data = profileDoc.data() as UserProfile;
        setProfile({
          name: data.name,
          email: data.email || user.email || "",
        });
        setIsLoading(false);
      } catch {
        await signOut(auth);
        router.replace(`/login?error=${encodeURIComponent("Sem permissão para ler users/{uid}.")}`);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    if (!auth) {
      router.replace("/login");
      return;
    }

    await signOut(auth);
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <div className="page">
        <main className="card videos-card">
          <p className="loading-message">Carregando sua área do aluno...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="card videos-card">
        <div className="videos-top-actions">
          <a className="secondary-link" href="#perfil-usuario">
            Ver perfil do usuário
          </a>
          <button className="primary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="videos-empty-state">
          <p className="eyebrow">Área do aluno HPE</p>
          <h1>Vídeos indisponíveis, lançamento do curso dia 16 de março.</h1>
        </section>

        <section className="profile-card" id="perfil-usuario">
          <h2>Perfil do usuário</h2>
          <p>
            <strong>Nome:</strong> {profile?.name || "Aluno HPE"}
          </p>
          <p>
            <strong>E-mail:</strong> {profile?.email || "Não informado"}
          </p>
        </section>
      </main>
    </div>
  );
}
