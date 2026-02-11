import { prisma } from "@/lib/prisma";
import { EditorLayoutLoader } from "@/components/EditorLayoutLoader";
import { ExtractedInstructions } from "@/lib/types";

type Props = {
  params: { id: string };
};

export default async function ProjectEditorPage({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: { id: params.id }
  });

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-400">
        Project not found.
      </div>
    );
  }

  const sections = await prisma.section.findMany({
    where: { projectId: project.id },
    orderBy: { order: "asc" }
  });

  const extracted = project.extractedInstructionsJSON as unknown as ExtractedInstructions;

  return (
    <div className="h-full overflow-hidden">
      <EditorLayoutLoader
        project={project}
        sections={sections}
        extracted={extracted}
      />
    </div>
  );
}

