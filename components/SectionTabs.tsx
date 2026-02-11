"use client";

import { Section } from "@prisma/client";

type Props = {
  sections: Section[];
  selected: string;
  onSelect: (id: string) => void;
};

export function SectionTabs({ sections, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col h-full border-r border-borderSoft bg-surfaceMuted/70">
      <div className="px-3 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Sections
      </div>
      <div className="px-2 pb-2">
        <button
          onClick={() => onSelect("general")}
          className={`pill-tab w-full justify-start ${
            selected === "general"
              ? "bg-accent text-white shadow-sm shadow-accent/40"
              : "bg-transparent text-slate-600 hover:bg-accentSoft"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accentAlt" />
          General instructions
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`pill-tab w-full justify-start ${
                selected === s.id
                  ? "bg-accent text-white shadow-sm shadow-accent/40"
                  : "bg-transparent text-slate-600 hover:bg-accentSoft"
              }`}
            >
              {s.title || "Untitled section"}
            </button>
          ))}
      </div>
    </div>
  );
}

