export const runtime = "nodejs";

import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { sendCourseAccessEmail } from "@/lib/mailer";
import { stripe } from "@/lib/stripe";

type SessionMetadata = {
  name?: string;
  cpf?: string;
  phone?: string;
  email?: string;
};

async function handlePaidSession(session: Stripe.Checkout.Session) {
  const sessionId = session.id;
  const email = session.customer_details?.email ?? session.customer_email ?? session.metadata?.email;

  if (!email) {
    return;
  }

  const metadata = (session.metadata ?? {}) as SessionMetadata;
  const name = metadata.name?.trim() || email;
  const cpf = metadata.cpf?.replace(/\D/g, "") ?? "";
  const phone = metadata.phone?.replace(/\D/g, "") ?? "";

  const { auth, db, FieldValue } = getFirebaseAdmin();
  const paymentRef = db.collection("payments").doc(sessionId);

  // Idempotência por session.id: se já existe, não processa novamente.
  const paymentSnapshot = await paymentRef.get();
  if (paymentSnapshot.exists) {
    return;
  }

  await paymentRef.set({
    checkoutSessionId: sessionId,
    paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    status: session.payment_status,
    email,
    createdAt: FieldValue.serverTimestamp(),
  });

  let uid: string;
  try {
    const existingUser = await auth.getUserByEmail(email);
    uid = existingUser.uid;
  } catch {
    const createdUser = await auth.createUser({
      email,
      displayName: name,
    });
    uid = createdUser.uid;
  }

  await db.collection("users").doc(uid).set(
    {
      name,
      email,
      cpf,
      phone,
      isActive: true,
      purchasedCourse: true,
      stripeSessionId: sessionId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 60 * 60 * 1000;

  await db.collection("password_tokens").doc(token).set({
    token,
    uid,
    email,
    used: false,
    createdAt: FieldValue.serverTimestamp(),
    expiresAt,
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return;
  }

  await sendCourseAccessEmail({
    to: email,
    name,
    setPasswordUrl: `${appUrl}/criar-senha?token=${token}`,
    loginUrl: `${appUrl}/login`,
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 500 });
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  // Body raw é obrigatório para validação da assinatura do Stripe.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      const isPaid =
        session.payment_status === "paid" ||
        event.type === "checkout.session.async_payment_succeeded";

      if (isPaid) {
        await handlePaidSession(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Falha ao processar webhook." }, { status: 500 });
  }
}
