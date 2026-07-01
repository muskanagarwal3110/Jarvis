import type { Message as MessageType } from "../types";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  return (
    <div className={`message-row ${message.role}`}>
      <div className="message-bubble">
        <div className="message-role">
          {message.role === "user" ? "You" : "Travel Agent"}
        </div>
        <div className="message-content">{message.content}</div>
      </div>
    </div>
  );
}
