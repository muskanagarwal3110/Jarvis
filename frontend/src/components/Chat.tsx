import { useState } from "react";
import type { FormEvent } from "react";
import { Message } from "./Message";
import { Loader } from "./Loader";
import { sendQuery } from "../services/api";
import type { Message as MessageType } from "../types";

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages: MessageType[] = [
      ...messages,
      { id: Date.now(), role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await sendQuery(trimmed);
      setMessages([
        ...nextMessages,
        { id: Date.now() + 1, role: "assistant", content: answer },
      ]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          id: Date.now() + 2,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "The bot failed to respond.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-[#FFFDF9] shadow-2xl shadow-black/40">
      {/* Header: ticket stub top half */}
      <div className="flex items-center justify-between gap-4 bg-[#1C2321] px-8 py-7">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#FFFDF9] sm:text-3xl">
            🌍 Travel Planner Agentic Application
          </h1>
        </div>
        <div className="hidden shrink-0 rounded-full border border-[#FFFDF9]/20 bg-[#FFFDF9]/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#FFFDF9]/90 sm:block">
          Plan smarter
        </div>
      </div>

      {/* Perforated tear line — the signature element */}
      <div className="relative h-0 border-t-2 border-dashed border-[#1C2321]/15">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#0f172a]" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#0f172a]" />
      </div>

      {/* Chat body */}
      <div className="flex min-h-[420px] flex-col gap-3 overflow-y-auto px-6 py-6 sm:px-8">
        <div className="rounded-2xl border border-[#2A6F77]/20 bg-[#2A6F77]/5 px-4 py-3.5 text-[#2A6F77]">
          How can I help you in planning a trip? Let me know where you want to
          visit.
        </div>

        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isLoading && <Loader />}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 border-t border-[#1C2321]/10 px-6 py-5 sm:px-8"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. Plan a trip to Goa for 5 days"
          aria-label="Travel request"
          className="flex-1 rounded-full border border-[#1C2321]/15 bg-white px-5 py-3 text-sm text-[#1C2321] outline-none transition-shadow duration-200 placeholder:text-[#1C2321]/40 focus:border-[#2A6F77] focus:ring-4 focus:ring-[#2A6F77]/15"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-[#C1622D] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#a8501f] hover:shadow-lg hover:shadow-[#C1622D]/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}