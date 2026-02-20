export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { sendPasswordResetEmail } from "@/lib/mailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = normalizeEmail(body.email ?? "");

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "Aplicação não configurada." }, { status: 500 });
    }

    const { auth, db, FieldValue } = getFirebaseAdmin();

    const existingUserSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (existingUserSnapshot.empty) {
      return NextResponse.json(
        { error: "Não encontramos cadastro com este e-mail." },
        { status: 404 }
      );
    }

    let authUser;
    try {
      authUser = await auth.getUserByEmail(email);
    } catch {
      return NextResponse.json(
        { error: "Não encontramos cadastro com este e-mail." },
        { status: 404 }
      );
    }

    const userData = existingUserSnapshot.docs[0].data() as { name?: string };
    const name = userData.name?.trim() || authUser.displayName || email;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000;

    await db.collection("password_tokens").doc(token).set({
      token,
      uid: authUser.uid,
      email,
      used: false,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
      type: "password_reset",
    });

    await sendPasswordResetEmail({
      to: email,
      name,
      resetPasswordUrl: `${appUrl}/criar-senha?token=${token}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar o e-mail." }, { status: 500 });
  }
}
