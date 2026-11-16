import "server-only";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";
import { LESSON_IDS } from "@/lib/course/catalog";

export type ProgressItem = {
  videoId: string;
  watchedSeconds: number;
  durationSeconds: number;
  notes: string;
  completed: boolean;
  updatedAt: number | null;
};

type ProgressDoc = {
  watchedSeconds?: number;
  watchedMinutes?: number;
  durationSeconds?: number;
  notes?: string;
  completed?: boolean;
  updatedAt?: { toMillis?: () => number };
};

function finiteOrZero(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function readProgress(uid: string): Promise<ProgressItem[]> {
  const { db } = getFirebaseAdmin();
  const snapshot = await db.collection("users").doc(uid).collection("video_progress").get();

  return snapshot.docs
    .filter((doc) => LESSON_IDS.has(doc.id))
    .map((doc) => {
      const data = doc.data() as ProgressDoc;
      const watchedSeconds =
        typeof data.watchedSeconds === "number"
          ? data.watchedSeconds
          : finiteOrZero(data.watchedMinutes) * 60;

      return {
        videoId: doc.id,
        watchedSeconds: Math.max(0, finiteOrZero(watchedSeconds)),
        durationSeconds: Math.max(0, finiteOrZero(data.durationSeconds)),
        notes: typeof data.notes === "string" ? data.notes : "",
        completed: data.completed === true,
        updatedAt: data.updatedAt?.toMillis?.() ?? null,
      };
    });
}
