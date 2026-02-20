"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import "./page.css";

type UserProfile = {
  email?: string;
  nome?: string;
  fullName?: string;
  phone?: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uid, setUid] = useState("");

  useEffect(() => {
    if (!auth || !db) {
      router.replace("/login?error=" + encodeURIComponent("Firebase não configurado."));
      return;
    }

    const authClient = auth;
    const dbClient = db;

    const unsubscribe = onAuthStateChanged(authClient, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const profileRef = doc(dbClient, "users", user.uid);
        const profileDoc = await getDoc(profileRef);

        if (!profileDoc.exists()) {
          await signOut(authClient);
          router.replace("/login");
          return;
        }

        const data = profileDoc.data() as UserProfile;

        setProfile({
          email: data.email || user.email || "",
          nome: data.nome || data.fullName || "",
          phone: data.phone || "",
        });
        setUid(user.uid);
        setIsLoading(false);
      } catch {
        await signOut(authClient);
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
        <main className="card profile-card-page">
          <p className="loading-message">Carregando perfil do usuário...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="card profile-card-page">
        <div className="profile-top-actions">
          <Link className="secondary-link" href="/videos">
            Ver vídeos
          </Link>
          <button className="primary-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="profile-highlight">
          <p className="eyebrow">Área do aluno HPE</p>
          <h1>Perfil do usuário</h1>
          <p>Suas informações ficam disponíveis aqui após o login.</p>
        </section>

        <section className="profile-details">
          <article className="detail-item">
            <h2>Nome</h2>
            <p>{profile?.nome || "Não informado"}</p>
          </article>
          <article className="detail-item">
            <h2>E-mail</h2>
            <p>{profile?.email || "Não informado"}</p>
          </article>
          <article className="detail-item">
            <h2>Telefone</h2>
            <p>{profile?.phone || "Não informado"}</p>
          </article>
          <article className="detail-item">
            <h2>ID do usuário</h2>
            <p>{uid || "Não informado"}</p>
          </article>
        </section>
      </main>
    </div>
  );
}
