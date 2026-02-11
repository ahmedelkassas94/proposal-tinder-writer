"use client";

import { ExtractedInstructions, SectionInstruction } from "@/lib/types";
import { useState, useMemo } from "react";

type Props =
  | {
      mode: "general";
      general: ExtractedInstructions["generalInstructions"];
      rawSnippets: ExtractedInstructions["rawSnippets"];
    }
  | {
      mode: "section";
      sectionTitle: string;
      section: SectionInstruction | undefined;
    };

export function InstructionPanel(props: Props) {
  const [query, setQuery] = useState("");
  const rawSnippets = props.mode === "general" ? props.rawSnippets : [];
  const filteredRaw = useMemo(
    () =>
      query
        ? rawSnippets.filter((s) =>
            s.text.toLowerCase().includes(query.toLowerCase())
          )
        : rawSnippets,
    [rawSnippets, query]
  );

  const filterList = (items: string[]) =>
    query
      ? items.filter((i) =>
          i.toLowerCase().includes(query.toLowerCase())
        )
      : items;

  if (props.mode === "general") {
    const { general } = props;

    return (
      <div className="flex flex-col h-full border-l border-borderSoft bg-surface">
        <div className="flex items-center justify-between px-3 py-2 border-b border-borderSoft/80">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            General instructions
          </div>
        </div>
        <div className="p-3 border-b border-borderSoft/80">
          <input
            className="w-full rounded-full bg-surfaceMuted border border-borderSoft px-3 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-accent"
            placeholder="Search instructions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3 text-xs">
          <SectionBlock title="Requirements" items={filterList(general.requirements)} />
          <SectionBlock title="Evaluation criteria" items={filterList(general.evaluationCriteria)} />
          <SectionBlock title="Formatting constraints" items={filterList(general.formattingConstraints)} />
          <SectionBlock title="Deadlines" items={filterList(general.deadlines)} />
          <SectionBlock title="Recommended keywords" items={filterList(general.recommendedKeywords)} />
          <SectionBlock title="Do not include" items={filterList(general.doNotInclude)} />
          <SectionBlock title="Other notes" items={filterList(general.otherNotes)} />

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
              Raw extracted snippets
            </div>
            <div className="space-y-1">
              {filteredRaw.length === 0 && (
                <div className="text-[11px] text-slate-400 italic">
                  No snippets.
                </div>
              )}
              {filteredRaw.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-borderSoft bg-surfaceMuted p-2"
                >
                  <div className="text-[10px] text-slate-500 mb-1">
                    Source: {s.source}
                    {s.mappedTo ? ` → ${s.mappedTo}` : ""}
                  </div>
                  <div>{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { sectionTitle, section } = props;
  const filterS = (items?: string[]) => filterList(items || []);

  return (
    <div className="flex flex-col h-full border-l border-borderSoft bg-surface">
      <div className="flex items-center justify-between px-3 py-2 border-b border-borderSoft/80">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Instructions: {sectionTitle}
        </div>
      </div>
      <div className="p-3 border-b border-borderSoft/80">
        <input
          className="w-full rounded-full bg-surfaceMuted border border-borderSoft px-3 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-accent"
          placeholder="Search within this section..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3 text-xs">
        <SectionBlock title="Specific requirements" items={filterS(section?.specificRequirements)} />
        <SectionBlock title="Evaluation criteria" items={filterS(section?.specificEvaluationCriteria)} />
        <SectionBlock title="Word limits" items={filterS(section?.wordLimits)} />
        <SectionBlock title="Formatting notes" items={filterS(section?.formattingNotes)} />
        <SectionBlock title="Specific keywords" items={filterS(section?.specificKeywords)} />
        <SectionBlock title="Other notes" items={filterS(section?.otherNotes)} />
      </div>
    </div>
  );
}

function SectionBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
        {title}
      </div>
      {items.length === 0 ? (
        <div className="text-[11px] text-slate-400 italic">None.</div>
      ) : (
        <ul className="space-y-1">
          {items.map((i, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-borderSoft bg-surfaceMuted px-2 py-1"
            >
              {i}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

