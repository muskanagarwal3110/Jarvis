import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { Message as MessageType } from "../types";
import { downloadTravelPlanPdf } from "../services/api";

interface MessageProps {
  message: MessageType;
}

// Custom renderers so markdown output matches the app's existing
// teal / rust / cream palette instead of default browser styles.
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-2 mt-3 text-lg font-bold text-[#2A6F77] first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-3 text-base font-bold text-[#2A6F77] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-sm font-bold uppercase tracking-wide text-[#C1622D] first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[#1C2321]">{children}</strong>
  ),
  em: ({ children }) => <em className="text-[#1C2321]/80">{children}</em>,
  hr: () => <hr className="my-3 border-[#C1622D]/20" />,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#2A6F77] underline decoration-[#2A6F77]/40 underline-offset-2 hover:decoration-[#2A6F77]"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[#1C2321]/5 px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-[#C1622D]/40 pl-3 text-[#1C2321]/80 last:mb-0">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-[0.9em]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-[#C1622D]/30">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1.5 text-left font-semibold text-[#2A6F77]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-[#C1622D]/10 px-2 py-1.5 align-top">
      {children}
    </td>
  ),
};

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

        {isUser ? (
          <div className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="text-[0.95rem]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
