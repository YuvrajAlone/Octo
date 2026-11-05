import { useEffect, useState, useRef } from "react";
import PromptInput from "./PromptInput";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSend: (message: string) => Promise<void>;
  loading: boolean;
}

export default function ChatPanel({
  messages,
  onSend,
  loading,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, loading]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#09090b]">
      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3 scrollbar-none">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-sm text-zinc-500">How can I help?</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={i}
              className={`flex w-full items-start gap-2.5 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] min-w-0 rounded-xl  ${
                  isUser
                    ? "bg-white/5 px-3 py-2.5"
                    : "bg-transparent pr-3 pl-1 py-2.5"
                }`}
              >
                <p className="whitespace-pre-wrap wrap-break-word text-[13px] leading-relaxed text-zinc-300">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start pl-2">
            <div className="flex-1">
              <div className="dot-loader">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="p-3">
        <PromptInput onSubmit={onSend} loading={loading} />
      </div>
    </div>
  );
}
