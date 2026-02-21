"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function CreatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URLSearchParams(window.location.search).get("token") ?? "";
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token inválido ou ausente.");
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("A senha deve ter ao menos 8 caracteres, com letras e números.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Não foi possível definir a senha.");
        return;
      }

      setSuccess("Senha criada com sucesso! Agora faça login.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Não foi possível definir a senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 20px" }}>
      <h1>Criar senha</h1>
      <p>Defina sua senha para acessar a área do aluno.</p>
      <p style={{ marginTop: -8, color: "#4b5563", fontSize: 14 }}>
        Use pelo menos 8 caracteres, com letras e números.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label htmlFor="password">Nova senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />

        <label htmlFor="confirmPassword">Confirmar senha</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={8}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar senha"}
        </button>
      </form>

      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {success ? (
        <p style={{ color: "#047857" }}>
          {success} <Link href="/login">Ir para login</Link>
        </p>
      ) : null}
    </main>
  );
}
