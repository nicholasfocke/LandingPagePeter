export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { LESSON_IDS } from "@/lib/course/catalog";
import { getAuthenticatedUser } from "@/lib/server/auth";
import { readProgress } from "@/lib/server/progress";

const NO_STORE = { "Cache-Control": "private, no-store" };
const MAX_NOTES_LENGTH = 20_000;
const MAX_SECONDS = 24 * 60 * 60;

function clampSeconds(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }
  return Math.min(MAX_SECONDS, Math.max(0, number));
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401, headers: NO_STORE });
  }

  try {
    const items = await readProgress(user.uid);
    return NextResponse.json({ ok: true, items }, { headers: NO_STORE });
  } catch (error) {
    console.error("[video-progress][GET] Falha ao carregar progresso:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o progresso." },
      { status: 500, headers: NO_STORE }
    );
  }
}

/**
 * Atualização parcial do progresso de uma aula. Apenas os campos enviados são
 * gravados, para que o salvamento automático do vídeo não sobrescreva anotações
 * (e vice-versa).
 */
export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401, headers: NO_STORE });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      videoId?: string;
      watchedSeconds?: number;
      durationSeconds?: number;
      notes?: string;
      completed?: boolean;
    };

    const videoId = String(body.videoId || "").trim();
    if (!LESSON_IDS.has(videoId)) {
      return NextResponse.json({ error: "Aula inválida." }, { status: 400, headers: NO_STORE });
    }

    const { db, FieldValue } = getFirebaseAdmin();
    const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };

    if (body.watchedSeconds !== undefined) {
      const watchedSeconds = clampSeconds(body.watchedSeconds);
      if (watchedSeconds !== null) {
        update.watchedSeconds = watchedSeconds;
        update.watchedMinutes = Math.round((watchedSeconds / 60) * 100) / 100;
      }
    }

    if (body.durationSeconds !== undefined) {
      const durationSeconds = clampSeconds(body.durationSeconds);
      if (durationSeconds !== null && durationSeconds > 0) {
        update.durationSeconds = durationSeconds;
      }
    }

    if (typeof body.notes === "string") {
      if (body.notes.length > MAX_NOTES_LENGTH) {
        return NextResponse.json(
          { error: "As anotações excedem o limite de caracteres." },
          { status: 400, headers: NO_STORE }
        );
      }
      update.notes = body.notes;
    }

    if (typeof body.completed === "boolean") {
      update.completed = body.completed;
      update.completedAt = body.completed ? FieldValue.serverTimestamp() : FieldValue.delete();
    }

    await db
      .collection("users")
      .doc(user.uid)
      .collection("video_progress")
      .doc(videoId)
      .set(update, { merge: true });

    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (error) {
    console.error("[video-progress][POST] Falha ao salvar progresso:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o progresso." },
      { status: 500, headers: NO_STORE }
    );
  }
}
