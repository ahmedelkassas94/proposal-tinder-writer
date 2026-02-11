"use client";

import { useEffect, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  projectId: string;
};

export function GeneralChatPanel({ projectId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch(`/api/projects/${projectId}/general-chat`);
      if (!res.ok) return;
      const json = (await res.json()) as { messages: ChatMessage[] };
      setMessages(json.messages);
    }
    fetchHistory();
  }, [projectId]);

  async function send() {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content: input
    };
    setMessages((prev) => [...prev, userMessage]);
    const payload = input;
    setInput("");

    try {
      const res = await fetch(`/api/projects/${projectId}/general-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: payload
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { assistantMessage: ChatMessage };
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
        <div className="text-xs font-medium text-slate-700">Global style &amp; instructions chat</div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-xs">
        {messages.length === 0 && (
          <div className="text-slate-500 text-[11px]">
            Describe the tone, writing style, and global instructions you want (e.g. formal EU proposal style,
            avoid buzzwords, emphasize impact). The assistant will remember these for all sections.
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
          placeholder="Explain the writing style and global instructions you want the AI to follow across the whole project..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={send}
            className="btn-primary text-xs px-4 py-1.5"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

