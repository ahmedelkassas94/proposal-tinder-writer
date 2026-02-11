"use client";

import { useEffect, useState } from "react";

type Props = {
  sectionId: string;
  initialContent: string;
};

export function SectionEditor({ sectionId, initialContent }: Props) {
  const [content, setContent] = useState(initialContent || "");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    setContent(initialContent || "");
  }, [sectionId, initialContent]);

  useEffect(() => {
    if (!sectionId) return;
    const handler = setTimeout(async () => {
      try {
        setSaving("saving");
        const res = await fetch(`/api/sections/${sectionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content })
        });
        if (!res.ok) throw new Error(await res.text());
        setSaving("saved");
        setTimeout(() => setSaving("idle"), 1200);
      } catch {
        setSaving("error");
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [sectionId, content]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-borderSoft bg-surface shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="px-3 pt-2 pb-1 text-xs font-medium text-slate-700">
          Section draft
        </div>
        <div className="pr-3 text-[11px] text-slate-400">
          {saving === "saving" && "Saving..."}
          {saving === "saved" && "Saved"}
          {saving === "error" && "Error saving"}
        </div>
      </div>
      <textarea
        className="flex-1 rounded-b-2xl border-t border-borderSoft bg-surfaceMuted px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start drafting this section..."
      />
    </div>
  );
}

