"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "PROPOSAL" | "TINDER";

export function ProjectSetupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("PROPOSAL");

  const [templateText, setTemplateText] = useState("");
  const [callText, setCallText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");

  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [callFile, setCallFile] = useState<File | null>(null);
  const [instructionsFile, setInstructionsFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "template" | "call" | "instructions"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (target === "template") setTemplateFile(file);
    if (target === "call") setCallFile(file);
    if (target === "instructions") setInstructionsFile(file);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!templateText.trim() && !templateFile) {
      setError("Please provide a template (text or file).");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mode", mode);
      formData.append("templateText", templateText);
      formData.append("callText", callText);
      formData.append("instructionsText", instructionsText);
      if (templateFile) formData.append("templateFile", templateFile);
      if (callFile) formData.append("callFile", callFile);
      if (instructionsFile) formData.append("instructionsFile", instructionsFile);

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      const data = (() => {
        try {
          return JSON.parse(text) as { id?: string; error?: string; message?: string };
        } catch {
          return { error: text || `Server error (${res.status})` };
        }
      })();
      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Server error (${res.status})`);
      }

      const json = data as { id: string };
      router.push(`/project/${json.id}`);
    } catch (err: any) {
      const msg = err?.message || "Failed to create project.";
      setError(
        msg +
          (msg.toLowerCase().includes("table") || msg.toLowerCase().includes("migrate")
            ? " Run in Codespace terminal: npx prisma migrate deploy"
            : "")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl py-6 px-4 md:px-0 space-y-6"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Project name</label>
        <input
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
          placeholder="e.g. SpaceRider Horizon 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Mode</label>
        <div className="inline-flex rounded-md border border-slate-700 bg-slate-900 p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("PROPOSAL")}
            className={`flex-1 px-3 py-1 rounded-md ${
              mode === "PROPOSAL"
                ? "bg-accent/80 text-slate-950 font-semibold"
                : "text-slate-300"
            }`}
          >
            Proposal
          </button>
          <button
            type="button"
            onClick={() => setMode("TINDER")}
            className={`flex-1 px-3 py-1 rounded-md ${
              mode === "TINDER"
                ? "bg-accent/80 text-slate-950 font-semibold"
                : "text-slate-300"
            }`}
          >
            Tinder
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Application template</span>
            <label className="cursor-pointer text-[11px] text-accent hover:underline">
              Upload file
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, "template")}
              />
            </label>
          </div>
          {templateFile && (
            <div className="text-[11px] text-slate-400 truncate">
              Selected: {templateFile.name}
            </div>
          )}
          <textarea
            className="min-h-[160px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent resize-vertical"
            placeholder="Paste the application template here..."
            value={templateText}
            onChange={(e) => setTemplateText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Call text</span>
            <label className="cursor-pointer text-[11px] text-accent hover:underline">
              Upload file
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, "call")}
              />
            </label>
          </div>
          {callFile && (
            <div className="text-[11px] text-slate-400 truncate">
              Selected: {callFile.name}
            </div>
          )}
          <textarea
            className="min-h-[160px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent resize-vertical"
            placeholder="Paste the call text here..."
            value={callText}
            onChange={(e) => setCallText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Other instructions</span>
            <label className="cursor-pointer text-[11px] text-accent hover:underline">
              Upload file
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, "instructions")}
              />
            </label>
          </div>
          {instructionsFile && (
            <div className="text-[11px] text-slate-400 truncate">
              Selected: {instructionsFile.name}
            </div>
          )}
          <textarea
            className="min-h-[160px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent resize-vertical"
            placeholder="Paste additional instructions / notes..."
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-950/40 border border-red-900 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60"
      >
        {loading ? "Creating project..." : "Create project"}
      </button>
    </form>
  );
}

