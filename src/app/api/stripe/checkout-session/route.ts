export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { validatePurchaseInput } from "@/lib/purchaseValidation";

function getCheckoutConfig() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const lote1End = process.env.LOTE1_END;
  const stripePriceLote1 = process.env.STRIPE_PRICE_LOTE1;
  const stripePriceFinal = process.env.STRIPE_PRICE_FINAL;

  if (!appUrl || !lote1End || !stripePriceLote1 || !stripePriceFinal) {
    throw new Error("Variáveis de checkout não configuradas.");
  }

  const lote1EndDate = new Date(lote1End);
  if (Number.isNaN(lote1EndDate.getTime())) {
    throw new Error("LOTE1_END inválida.");
  }

  const isLote1 = Date.now() <= lote1EndDate.getTime();

  return {
    appUrl,
    priceId: isLote1 ? stripePriceLote1 : stripePriceFinal,
    priceTier: isLote1 ? "lote1" : "final",
  } as const;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      cpf?: string;
      phone?: string;
    };

    const validation = validatePurchaseInput({
      name: body.name ?? "",
      email: body.email ?? "",
      cpf: body.cpf ?? "",
      phone: body.phone ?? "",
    });

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const { appUrl, priceId, priceTier } = getCheckoutConfig();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: validation.data.email,
      success_url: `${appUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancelado`,
      metadata: {
        name: validation.data.name,
        cpf: validation.data.cpf,
        phone: validation.data.phone,
        email: validation.data.email,
        priceTier,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Não foi possível gerar URL do checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Erro ao criar sessão de checkout." }, { status: 500 });
  }
}
