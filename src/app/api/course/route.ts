export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth";
import { getCourseAccess } from "@/lib/server/courseAccess";
import { readProgress } from "@/lib/server/progress";

const NO_STORE = { "Cache-Control": "private, no-store" };

/** Perfil, direito de acesso e progresso do aluno autenticado. */
export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401, headers: NO_STORE });
  }

  try {
    const [access, progress] = await Promise.all([getCourseAccess(user), readProgress(user.uid)]);

    return NextResponse.json(
      {
        profile: access.profile,
        hasAccess: access.hasAccess,
        progress,
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[course][GET] Falha ao carregar dados do aluno:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar seus dados agora." },
      { status: 500, headers: NO_STORE }
    );
  }
}
