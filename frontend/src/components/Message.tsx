import { useState } from "react";
import type { Message as MessageType } from "../types";
import { downloadTravelPlanPdf } from "../services/api";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadTravelPlanPdf(message.content);
    } catch (error) {
      console.error("PDF download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md ${
          isUser
            ? "bg-[#2A6F77] text-[#FFFDF9]"
            : "border border-[#C1622D]/15 bg-[#F2E8DC] text-[#1C2321]"
        }`}
      >
        <div
          className={`mb-1 flex items-center justify-between gap-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
            isUser ? "text-[#FFFDF9]/70" : "text-[#C1622D]/80"
          }`}
        >
          <span>{isUser ? "You" : "Travel Agent"}</span>
          {!isUser && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 rounded-full border border-[#C1622D]/30 px-2 py-0.5 text-[0.6rem] normal-case tracking-normal text-[#C1622D] transition-colors duration-200 hover:bg-[#C1622D]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading && (
                <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-[#C1622D]/30 border-t-[#C1622D]" />
              )}
              {isDownloading ? "Preparing…" : "Download PDF"}
            </button>
          )}
        </div>
        <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}