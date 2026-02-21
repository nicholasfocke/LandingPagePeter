export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

function isStrongPassword(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function getPasswordUpdateErrorResponse(error: unknown) {
  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError.code ?? "";

  if (code === "auth/user-not-found") {
    return NextResponse.json({ error: "Usuário não encontrado para este token." }, { status: 400 });
  }

  if (
    code === "auth/invalid-password" ||
    code === "auth/password-does-not-meet-requirements" ||
    code === "auth/password-too-short" ||
    code === "auth/password-too-long" ||
    code === "auth/invalid-argument"
  ) {
    return NextResponse.json(
      { error: "A senha não atende aos requisitos de segurança do Firebase." },
      { status: 400 }
    );
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = (body.token ?? "").trim();
    const password = body.password ?? "";

    if (!token) {
      return NextResponse.json({ error: "Token inválido." }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "A senha deve ter ao menos 8 caracteres, incluindo letras e números." },
        { status: 400 }
      );
    }

    const { auth, db, FieldValue } = getFirebaseAdmin();
    const tokenRef = db.collection("password_tokens").doc(token);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return NextResponse.json({ error: "Token não encontrado." }, { status: 400 });
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
      return NextResponse.json({ error: "Token inválido." }, { status: 400 });
    }

    if (used) {
      return NextResponse.json({ error: "Token já utilizado." }, { status: 400 });
    }

    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: "Token expirado." }, { status: 400 });
    }

    try {
      await auth.updateUser(uid, { password });
    } catch (error) {
      const mappedResponse = getPasswordUpdateErrorResponse(error);
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
        console.error(`[set-password] Falha ao atualizar ${target}:`, result.reason);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[set-password] Falha ao definir senha:", error);
    return NextResponse.json({ error: "Falha ao definir senha. Verifique os logs do servidor." }, { status: 500 });
  }
}
