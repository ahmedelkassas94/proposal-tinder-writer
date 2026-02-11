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

const CHAT_HEIGHT = 260;

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
    <div className="flex flex-col h-full rounded-2xl border border-borderSoft bg-surface/80 shadow-sm overflow-hidden">
      {/* Top bar: full width */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-borderSoft/80 bg-surface/70">
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

      {/* Three columns: Tabs | Editor+Chat | Instructions */}
      <div className="flex-1 flex min-h-0">
        {/* Left: vertical tabs */}
        <div className="w-56 shrink-0 border-r border-borderSoft bg-surfaceMuted/60 flex flex-col">
          <SectionTabs
            sections={sections}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        {/* Middle: editor (top) + chat (bottom) - same layout for every tab */}
        <div className="flex-1 flex flex-col min-w-0 p-3 gap-3">
          {/* Editor slot - always present, content switches by tab */}
          <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-borderSoft bg-surface shadow-sm overflow-hidden">
            {selected === "general" && (
              <div className="flex-1 overflow-auto p-4 text-xs">
                <div className="text-sm font-semibold mb-2">
                  General instructions
                </div>
                <p className="mb-3 text-slate-500">
                  Use this tab to set the project-wide writing style, tone, and
                  constraints. The assistant will apply this style when helping
                  with each section. Use the chat below to define your preferences.
                </p>
              </div>
            )}
            {selected !== "general" && selectedSection && (
              <SectionEditor
                sectionId={selectedSection.id}
                initialContent={selectedSection.content}
              />
            )}
            {selected !== "general" && !selectedSection && (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Select a section in the list to edit.
              </div>
            )}
          </div>

          {/* Chat slot - always present, content switches by tab */}
          <div
            className="shrink-0 rounded-2xl border border-borderSoft bg-surface shadow-sm overflow-hidden flex flex-col"
            style={{ height: CHAT_HEIGHT }}
          >
            {selected === "general" && (
              <GeneralChatPanel projectId={project.id} />
            )}
            {selectedSection && (
              <AIChatPanel
                projectId={project.id}
                sectionId={selectedSection.id}
              />
            )}
            {selected !== "general" && !selectedSection && (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                Select a section to use the section AI assistant.
              </div>
            )}
          </div>
        </div>

        {/* Right: instructions - always visible when toggled on */}
        {instructionsVisible && (
          <div className="w-80 shrink-0 border-l border-borderSoft bg-surfaceMuted/60 flex flex-col min-h-0">
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
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500 p-4">
                Select a section to see its instructions.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
