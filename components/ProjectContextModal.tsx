"use client";

import { useState } from "react";

type Props = {
  templateRaw: string;
  callRaw: string;
  instructionsRaw: string;
};

export function ProjectContextModal({ templateRaw, callRaw, instructionsRaw }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost"
      >
        Project context
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="max-w-4xl w-full max-h-[80vh] bg-slate-950 border border-slate-800 rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
              <div className="text-sm font-semibold">Project context</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-100"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs px-4 py-3 space-y-4">
              <ContextBlock title="Template" text={templateRaw} />
              <ContextBlock title="Call text" text={callRaw} />
              <ContextBlock title="Other instructions" text={instructionsRaw} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ContextBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
        {title}
      </div>
      <pre className="whitespace-pre-wrap rounded-md border border-slate-800 bg-slate-900/70 px-2 py-2">
        {text || "(empty)"}
      </pre>
    </div>
  );
}

