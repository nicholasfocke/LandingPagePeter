export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { LESSON_IDS } from "@/lib/course/catalog";
import { getAuthenticatedUser } from "@/lib/server/auth";
import { getCourseAccess } from "@/lib/server/courseAccess";
import { getLessonMedia } from "@/lib/server/courseMedia";

const NO_STORE = { "Cache-Control": "private, no-store" };

/** Entrega as URLs (assinadas e temporárias) do vídeo e do material de uma aula. */
export async function GET(request: Request, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;

  if (!LESSON_IDS.has(lessonId)) {
    return NextResponse.json({ error: "Aula não encontrada." }, { status: 404, headers: NO_STORE });
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401, headers: NO_STORE });
  }

  try {
    const { hasAccess } = await getCourseAccess(user);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Seu acesso a este conteúdo não está ativo." },
        { status: 403, headers: NO_STORE }
      );
    }

    const media = await getLessonMedia(lessonId);
    if (!media) {
      return NextResponse.json({ error: "Aula não encontrada." }, { status: 404, headers: NO_STORE });
    }

    return NextResponse.json(media, { headers: NO_STORE });
  } catch (error) {
    console.error("[course][lesson] Falha ao carregar mídia da aula:", lessonId, error);
    return NextResponse.json(
      { error: "Não foi possível carregar esta aula agora." },
      { status: 500, headers: NO_STORE }
    );
  }
}
