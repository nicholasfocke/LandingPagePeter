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
              color: "#4b5563",
            }}
          >
            {isPasswordVisible ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 18, height: 18, display: "block" }}>
                <path d="M3.27 2 2 3.27l3 3A11.86 11.86 0 0 0 1 12s4 7 11 7a10.9 10.9 0 0 0 4.23-.85L20.73 22 22 20.73 3.27 2Zm8.01 8.01 2.71 2.71A3 3 0 0 1 11.28 10Zm-2.56.18A3 3 0 0 0 13.81 15Z" fill="currentColor" />
                <path d="M12 5a10.8 10.8 0 0 1 11 7 12.6 12.6 0 0 1-2.65 3.36l-1.42-1.42A9.1 9.1 0 0 0 20.78 12 8.92 8.92 0 0 0 12 7.06a9.1 9.1 0 0 0-2.27.29L8.11 5.73A11.2 11.2 0 0 1 12 5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 18, height: 18, display: "block" }}>
                <path d="M12 5a10.8 10.8 0 0 1 11 7 10.8 10.8 0 0 1-11 7A10.8 10.8 0 0 1 1 12 10.8 10.8 0 0 1 12 5Zm0 2.06A8.92 8.92 0 0 0 3.22 12 8.92 8.92 0 0 0 12 16.94 8.92 8.92 0 0 0 20.78 12 8.92 8.92 0 0 0 12 7.06Z" fill="currentColor" />
                <path d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Z" fill="currentColor" />
              </svg>
            )}
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
              color: "#4b5563",
            }}
          >
            {isConfirmPasswordVisible ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 18, height: 18, display: "block" }}>
                <path d="M3.27 2 2 3.27l3 3A11.86 11.86 0 0 0 1 12s4 7 11 7a10.9 10.9 0 0 0 4.23-.85L20.73 22 22 20.73 3.27 2Zm8.01 8.01 2.71 2.71A3 3 0 0 1 11.28 10Zm-2.56.18A3 3 0 0 0 13.81 15Z" fill="currentColor" />
                <path d="M12 5a10.8 10.8 0 0 1 11 7 12.6 12.6 0 0 1-2.65 3.36l-1.42-1.42A9.1 9.1 0 0 0 20.78 12 8.92 8.92 0 0 0 12 7.06a9.1 9.1 0 0 0-2.27.29L8.11 5.73A11.2 11.2 0 0 1 12 5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 18, height: 18, display: "block" }}>
                <path d="M12 5a10.8 10.8 0 0 1 11 7 10.8 10.8 0 0 1-11 7A10.8 10.8 0 0 1 1 12 10.8 10.8 0 0 1 12 5Zm0 2.06A8.92 8.92 0 0 0 3.22 12 8.92 8.92 0 0 0 12 16.94 8.92 8.92 0 0 0 20.78 12 8.92 8.92 0 0 0 12 7.06Z" fill="currentColor" />
                <path d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Z" fill="currentColor" />
              </svg>
            )}
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
