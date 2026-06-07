import { notFound } from "next/navigation";
import { ALL_LESSONS, lessonById } from "@/lib/content/modules";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ id: l.id }));
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = lessonById(params.id);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} />;
}
