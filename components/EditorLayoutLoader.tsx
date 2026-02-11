"use client";

import dynamic from "next/dynamic";
import type { Project, Section } from "@prisma/client";
import type { ExtractedInstructions } from "@/lib/types";

const EditorLayout = dynamic(
  () => import("@/components/EditorLayout").then((m) => m.EditorLayout),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-borderSoft bg-surface/80">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading editor…</p>
        </div>
      </div>
    )
  }
);

type Props = {
  project: Project;
  sections: Section[];
  extracted: ExtractedInstructions;
};

export function EditorLayoutLoader({ project, sections, extracted }: Props) {
  return (
    <EditorLayout
      project={project}
      sections={sections}
      extracted={extracted}
    />
  );
}
