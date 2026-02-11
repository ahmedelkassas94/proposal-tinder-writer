"use client";

import { useEffect, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  projectId: string;
  sectionId: string;
};

const quickActions = [
  { id: "outline", label: "AI: Suggest outline", action: "Suggest an outline for this section." },
  { id: "clarity", label: "AI: Improve clarity", action: "Improve clarity and coherence." },
  { id: "persuasive", label: "AI: Make it more persuasive", action: "Make the text more persuasive." },
  { id: "criteria", label: "AI: Fit to evaluation criteria", action: "Align closely with evaluation criteria." },
  { id: "wordlimit", label: "AI: Reduce to word limit", action: "Reduce content to match the strictest word limit while preserving key points." }
];

export function AIChatPanel({ projectId, sectionId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch(`/api/sections/${sectionId}/chat`);
      if (!res.ok) return;
      const json = (await res.json()) as { messages: ChatMessage[] };
      setMessages(json.messages);
    }
    fetchHistory();
  }, [sectionId]);

  async function send(actionText?: string) {
    if (!input.trim() && !actionText) return;
    setLoading(true);
    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content: actionText ? `${actionText}\n\n${input}` : input
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(`/api/sections/${sectionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          sectionId,
          userMessage: userMessage.content
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { assistantMessage: ChatMessage; newSectionContent: string };
      setMessages((prev) => [...prev, json.assistantMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-borderSoft bg-surface shadow-sm">
      <div className="px-3 py-2 border-b border-borderSoft/80 flex items-center justify-between">
        <div className="text-xs font-medium text-slate-700">Section AI assistant</div>
      </div>
      <div className="px-3 py-2 flex flex-wrap gap-2 border-b border-borderSoft/80">
        {quickActions.map((qa) => (
          <button
            key={qa.id}
            type="button"
            disabled={loading}
            onClick={() => send(qa.action)}
            className="rounded-full border border-borderSoft bg-surfaceMuted px-2.5 py-1 text-[11px] text-slate-600 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {qa.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-xs">
        {messages.length === 0 && (
          <div className="text-slate-500 text-[11px]">
            Ask the assistant to help you refine this section. It will only return the section text.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-2xl px-3 py-1.5 ${
              m.role === "user"
                ? "ml-auto bg-accent text-white"
                : "mr-auto bg-surfaceMuted text-slate-700"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="border-t border-borderSoft/80 px-3 py-2 space-y-1">
        <textarea
          className="w-full min-h-[60px] max-h-[120px] rounded-xl bg-surfaceMuted border border-borderSoft px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-accent resize-y"
          placeholder="Ask for help with this section..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => send()}
            className="btn-primary text-xs px-4 py-1.5"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

