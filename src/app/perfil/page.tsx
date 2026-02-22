"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import "./page.css";

type UserProfile = {
  email?: string;
  name?: string;
  nome?: string;
  fullName?: string;
  phone?: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fullName = useMemo(() => {
    const rawName = (profile?.name || profile?.nome || profile?.fullName || "").trim();
    return rawName;
  }, [profile?.fullName, profile?.name, profile?.nome]);

  const firstName = useMemo(() => {
    const rawName = fullName;
    if (!rawName) {
      return "Aluno";
    }

    return rawName.split(" ")[0];
  }, [fullName]);

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
          name: data.name || "",
          nome: data.nome || "",
          fullName: data.fullName || "",
          phone: data.phone || "",
        });
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
          <div className="profile-avatar">{firstName.charAt(0).toUpperCase()}</div>
          <div className="profile-highlight-copy">
            <p className="eyebrow">Área do aluno HPE</p>
            <h1>Olá, {firstName}! Esse é o seu perfil.</h1>
            <p>Mantenha seus dados atualizados para receber novidades dos próximos lançamentos.</p>
          </div>
        </section>

        <section className="profile-details">
          <article className="detail-item detail-item-emphasis">
            <h2>Nome completo</h2>
            <p>{fullName || "Não informado"}</p>
          </article>
          <article className="detail-item">
            <h2>E-mail</h2>
            <p>{profile?.email || "Não informado"}</p>
          </article>
          <article className="detail-item">
            <h2>Telefone</h2>
            <p>{profile?.phone || "Não informado"}</p>
          </article>
        </section>
      </main>
    </div>
  );
}
