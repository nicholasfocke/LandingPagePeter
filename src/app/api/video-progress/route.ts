export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice("Bearer ".length).trim();
}

async function getAuthenticatedUserId(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return "";
  }

  try {
    const { auth } = getFirebaseAdmin();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  try {
    const uid = await getAuthenticatedUserId(request);
    if (!uid) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { db } = getFirebaseAdmin();
    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("video_progress")
      .get();

    const items = snapshot.docs.map((doc) => {
      const data = doc.data() as {
        watchedSeconds?: number;
        watchedMinutes?: number;
        durationSeconds?: number;
        notes?: string;
      };

      const watchedSeconds =
        typeof data.watchedSeconds === "number"
          ? data.watchedSeconds
          : Number(data.watchedMinutes || 0) * 60;

      return {
        videoId: doc.id,
        watchedSeconds: Number.isFinite(watchedSeconds) ? watchedSeconds : 0,
        durationSeconds: Number.isFinite(data.durationSeconds) ? Number(data.durationSeconds) : 0,
        notes: typeof data.notes === "string" ? data.notes : "",
      };
    });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error("[video-progress][GET] Falha ao carregar progresso:", error);
    return NextResponse.json({ error: "Não foi possível carregar o progresso." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const uid = await getAuthenticatedUserId(request);
    if (!uid) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = (await request.json()) as {
      videoId?: string;
      watchedSeconds?: number;
      watchedMinutes?: number;
      durationSeconds?: number;
      notes?: string;
    };

    const videoId = String(body.videoId || "").trim();
    if (!videoId) {
      return NextResponse.json({ error: "videoId é obrigatório." }, { status: 400 });
    }

    const watchedSeconds = Math.max(0, Number(body.watchedSeconds || 0));
    const watchedMinutesFromBody = Number(body.watchedMinutes);
    const watchedMinutes = Number.isFinite(watchedMinutesFromBody)
      ? watchedMinutesFromBody
      : Math.round((watchedSeconds / 60) * 100) / 100;
    const durationSeconds = Math.max(0, Number(body.durationSeconds || 0));
    const notes = typeof body.notes === "string" ? body.notes : "";

    const { db, FieldValue } = getFirebaseAdmin();
    await db
      .collection("users")
      .doc(uid)
      .collection("video_progress")
      .doc(videoId)
      .set(
        {
          watchedSeconds,
          watchedMinutes,
          durationSeconds,
          notes,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[video-progress][POST] Falha ao salvar progresso:", error);
    return NextResponse.json({ error: "Não foi possível salvar o progresso." }, { status: 500 });
  }
}
