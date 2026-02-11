"use client";

import { useState } from "react";
import type { Project, Section } from "@prisma/client";
import { ExtractedInstructions } from "@/lib/types";
import { SectionTabs } from "./SectionTabs";
import { InstructionPanel } from "./InstructionPanel";
import { SectionEditor } from "./SectionEditor";
import { AIChatPanel } from "./AIChatPanel";
import { ProjectContextModal } from "./ProjectContextModal";
import { GeneralChatPanel } from "./GeneralChatPanel";

type Props = {
  project: Project;
  sections: Section[];
  extracted: ExtractedInstructions;
};

export function EditorLayout({ project, sections, extracted }: Props) {
  const [selected, setSelected] = useState<string>("general");
  const [instructionsVisible, setInstructionsVisible] = useState(true);

  const selectedSection =
    selected === "general"
      ? null
      : sections.find((s) => s.id === selected) || null;

  const sectionInstruction =
    selectedSection &&
    extracted.sections.find(
      (s) =>
        s.sectionTitle.toLowerCase() ===
        selectedSection.title.toLowerCase()
    );

  async function handleExport() {
    const res = await fetch(`/api/projects/${project.id}/export`);
    if (!res.ok) {
      alert("Failed to export document.");
      return;
    }
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = /filename=\"?([^\"]+)\"?/.exec(disposition);
    const fileName = match?.[1] || `${project.name}_export.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full rounded-2xl border border-borderSoft bg-surface/80 shadow-sm">
      <div className="w-60 shrink-0 border-r border-borderSoft bg-surfaceMuted/60 rounded-l-2xl">
        <SectionTabs
          sections={sections}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      <div className="flex-1 flex flex-col rounded-r-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-borderSoft/80 bg-surface/70 rounded-tr-2xl">
          <div>
            <div className="text-sm font-semibold tracking-tight">{project.name}</div>
            <div className="text-[11px] text-slate-500">
              Mode: {project.mode === "PROPOSAL" ? "Proposal" : "Tinder"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ProjectContextModal
              templateRaw={project.templateRaw}
              callRaw={project.callRaw}
              instructionsRaw={project.instructionsRaw}
            />
            <button
              type="button"
              onClick={() => setInstructionsVisible((v) => !v)}
              className="btn-ghost"
            >
              {instructionsVisible ? "Hide instructions" : "Show instructions"}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="btn-primary text-xs px-4 py-1.5"
            >
              Export (.docx)
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
            {selected === "general" ? (
              <div className="flex-1 grid grid-rows-[minmax(0,1fr)_minmax(0,240px)] gap-3">
                <div className="rounded-2xl border border-borderSoft bg-surface p-4 text-xs shadow-sm overflow-auto">
                  <div className="text-sm font-semibold mb-2">
                    General instructions overview
                  </div>
                  <p className="mb-3 text-slate-500">
                    Use this tab to define the project-wide writing style, tone, and constraints.
                    The assistant will apply this style when helping you with each individual section.
                  </p>
                </div>
                <GeneralChatPanel projectId={project.id} />
              </div>
            ) : selectedSection ? (
              <div className="flex-1 grid grid-rows-[minmax(0,1fr)_minmax(0,220px)] gap-3">
                <SectionEditor
                  sectionId={selectedSection.id}
                  initialContent={selectedSection.content}
                />
                <AIChatPanel
                  projectId={project.id}
                  sectionId={selectedSection.id}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Select a section to begin.
              </div>
            )}
          </div>

          {instructionsVisible && (
            <div className="w-80 shrink-0 border-l border-borderSoft bg-surfaceMuted/60 rounded-br-2xl">
              {selected === "general" ? (
                <InstructionPanel
                  mode="general"
                  general={extracted.generalInstructions}
                  rawSnippets={extracted.rawSnippets}
                />
              ) : selectedSection ? (
                <InstructionPanel
                  mode="section"
                  sectionTitle={selectedSection.title}
                  section={sectionInstruction}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No section selected.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

