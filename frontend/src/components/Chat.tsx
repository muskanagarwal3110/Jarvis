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
    <div className="chat-shell">
      <div className="chat-header">
        <div>
          <p className="eyebrow">AI Trip Planner</p>
          <h1>🌍 Travel Planner Agentic Application</h1>
        </div>
        <div className="header-badge">Plan smarter</div>
      </div>

      <div className="chat-body">
        <div className="chat-intro">
          <p>
            How can I help you in planning a trip? Let me know where you want to
            visit.
          </p>
        </div>

        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isLoading && <Loader />}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. Plan a trip to Goa for 5 days"
          aria-label="Travel request"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
