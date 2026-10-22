import { notFound } from "next/navigation";
import { SAMPLE_LESSONS } from "@/lib/domain/lessons-data";
import { LessonClient } from "./LessonClient";

export const instant = false;

export async function generateStaticParams() {
  return Object.keys(SAMPLE_LESSONS).map((slug) => ({ slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lessonData = SAMPLE_LESSONS[slug];

  if (!lessonData) {
    notFound();
  }

  return <LessonClient data={lessonData} />;
}
