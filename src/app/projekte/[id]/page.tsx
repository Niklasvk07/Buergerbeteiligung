import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/data";
import { ProjectDetail } from "./ProjectDetail";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getProject(id)) notFound();
  return <ProjectDetail id={id} />;
}
