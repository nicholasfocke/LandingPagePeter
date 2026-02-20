export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

function isStrongPassword(password: string) {
  return password.length >= 8;
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
      return NextResponse.json({ error: "A senha deve ter ao menos 8 caracteres." }, { status: 400 });
    }

    const { auth, db, FieldValue } = getFirebaseAdmin();
    const tokenRef = db.collection("password_tokens").doc(token);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return NextResponse.json({ error: "Token não encontrado." }, { status: 400 });
    }

    const tokenData = tokenDoc.data() as {
      uid: string;
      used: boolean;
      expiresAt: number;
    };

    if (tokenData.used) {
      return NextResponse.json({ error: "Token já utilizado." }, { status: 400 });
    }

    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: "Token expirado." }, { status: 400 });
    }

    await auth.updateUser(tokenData.uid, { password });

    await tokenRef.set(
      {
        used: true,
        usedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Falha ao definir senha." }, { status: 500 });
  }
}
