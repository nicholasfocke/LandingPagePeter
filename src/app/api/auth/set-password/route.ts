export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

type ErrorPayload = {
  error: string;
  requestId: string;
};

function isStrongPassword(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function toErrorInfo(error: unknown) {
  const err = error as { code?: string; message?: string; stack?: string };
  return {
    code: err?.code ?? "unknown",
    message: err?.message ?? String(error),
    stack: err?.stack,
  };
}

function jsonError(message: string, requestId: string, status: number) {
  return NextResponse.json<ErrorPayload>({ error: message, requestId }, { status });
}

function getPasswordUpdateErrorResponse(error: unknown, requestId: string) {
  const firebaseError = error as { code?: string };
  const code = firebaseError.code ?? "";

  if (code === "auth/user-not-found") {
    return jsonError("Usuário não encontrado para este token.", requestId, 400);
  }

  if (
    code === "auth/invalid-password" ||
    code === "auth/password-does-not-meet-requirements" ||
    code === "auth/password-too-short" ||
    code === "auth/password-too-long" ||
    code === "auth/invalid-argument"
  ) {
    return jsonError("A senha não atende aos requisitos de segurança do Firebase.", requestId, 400);
  }

  return null;
}

function getServerConfigErrorResponse(error: unknown, requestId: string) {
  const errorInfo = toErrorInfo(error);

  if (errorInfo.message.includes("FIREBASE_ADMIN_JSON")) {
    return jsonError("Configuração do servidor incompleta (FIREBASE_ADMIN_JSON).", requestId, 500);
  }

  return null;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  console.log(`[set-password][${requestId}] request received`);

  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = (body.token ?? "").trim();
    const password = body.password ?? "";

    if (!token) {
      return jsonError("Token inválido.", requestId, 400);
    }

    if (!isStrongPassword(password)) {
      return jsonError(
        "A senha deve ter ao menos 8 caracteres, incluindo letras e números.",
        requestId,
        400
      );
    }

    const { auth, db, FieldValue } = getFirebaseAdmin();
    const tokenRef = db.collection("password_tokens").doc(token);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return jsonError("Token não encontrado.", requestId, 400);
    }

    const tokenData = tokenDoc.data() as {
      uid?: string;
      used?: boolean;
      expiresAt?: number | { toMillis?: () => number };
    };

    const uid = tokenData.uid?.trim();
    const used = tokenData.used === true;
    const expiresAt =
      typeof tokenData.expiresAt === "number"
        ? tokenData.expiresAt
        : tokenData.expiresAt?.toMillis?.();

    if (!uid || typeof expiresAt !== "number") {
      return jsonError("Token inválido.", requestId, 400);
    }

    if (used) {
      return jsonError("Token já utilizado.", requestId, 400);
    }

    if (Date.now() > expiresAt) {
      return jsonError("Token expirado.", requestId, 400);
    }

    try {
      await auth.updateUser(uid, { password });
    } catch (error) {
      const mappedResponse = getPasswordUpdateErrorResponse(error, requestId);
      if (mappedResponse) {
        return mappedResponse;
      }

      throw error;
    }

    const updateResults = await Promise.allSettled([
      db.collection("users").doc(uid).set(
        {
          updatedAt: FieldValue.serverTimestamp(),
          passwordUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      ),
      tokenRef.set(
        {
          used: true,
          usedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      ),
    ]);

    updateResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const target = index === 0 ? "users" : "password_tokens";
        console.error(`[set-password][${requestId}] Falha ao atualizar ${target}:`, toErrorInfo(result.reason));
      }
    });

    console.log(`[set-password][${requestId}] password updated successfully`);
    return NextResponse.json({ ok: true, requestId });
  } catch (error) {
    const configErrorResponse = getServerConfigErrorResponse(error, requestId);
    if (configErrorResponse) {
      console.error(`[set-password][${requestId}] Erro de configuração:`, toErrorInfo(error));
      return configErrorResponse;
    }

    console.error(`[set-password][${requestId}] Falha ao definir senha:`, toErrorInfo(error));
    return jsonError("Falha ao definir senha.", requestId, 500);
  }
}
