"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function CreatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState("");

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
    setRequestId("");

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

      const payload = (await response.json()) as { error?: string; requestId?: string };
      if (!response.ok) {
        setError(payload.error ?? "Não foi possível definir a senha.");
        setRequestId(payload.requestId ?? "");
        return;
      }

      setRequestId(payload.requestId ?? "");
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
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            style={{ width: "100%", paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={isPasswordVisible}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 0,
            }}
          >
            {isPasswordVisible ? "🙈" : "👁️"}
          </button>
        </div>

        <label htmlFor="confirmPassword">Confirmar senha</label>
        <div style={{ position: "relative" }}>
          <input
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            style={{ width: "100%", paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={() => setIsConfirmPasswordVisible((current) => !current)}
            aria-label={isConfirmPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={isConfirmPasswordVisible}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 0,
            }}
          >
            {isConfirmPasswordVisible ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar senha"}
        </button>
      </form>

      {error ? (
        <p style={{ color: "#b91c1c" }}>
          {error}
          {requestId ? <span> (código: {requestId})</span> : null}
        </p>
      ) : null}
      {success ? (
        <p style={{ color: "#047857" }}>
          {success} <Link href="/login">Ir para login</Link>
        </p>
      ) : null}
    </main>
  );
}
