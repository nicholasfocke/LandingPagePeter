"use client";

import { notFound, useParams } from "next/navigation";
import LessonView from "@/components/student/LessonView";
import { getLesson } from "@/lib/course/catalog";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);

  if (!lesson) {
    notFound();
  }

  // `key` garante estado limpo (player, notas, timers) ao trocar de aula.
  return <LessonView key={lesson.id} lesson={lesson} />;
}
