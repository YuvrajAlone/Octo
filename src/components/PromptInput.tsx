import { useState, ComponentProps, useRef, useEffect } from "react";
import {
  Plus,
  MicIcon,
  Loader2Icon,
  ArrowRightIcon,
  Upload,
} from "lucide-react";

type PromptInputProps = {
  loading?: boolean;
  variant?: "default" | "glass";
  onSubmit: (prompt: string) => void | Promise<void | boolean>;
  loginMessage?: boolean;
};

export default function PromptInput({
  onSubmit,
  loading = false,
  variant = "default",
  loginMessage = false,
}: PromptInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoFocus = true;

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    await onSubmit(input.trim());

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (variant === "glass") {
    return (
      <>
        {loginMessage ? (
          <p className="mt-3 text-sm text-white/60">Sign in to begin.</p>
        ) : (
          <p className="mt-3 text-sm text-white/50">
            Describe your idea. OCTO will turn it into a website.
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="mt-5 w-full max-w-2xl bg-white/3 backdrop-blur-xl rounded-xl ring-1 ring-white/10 overflow-hidden transition"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Articulate your vision..."
            disabled={loading}
            rows={2}
            className="w-full p-4 pb-0 resize-none placeholder:text-white/40 outline-none bg-transparent text-white text-base scrollbar-none"
          />

          <div className="flex items-center justify-between pb-3 px-3 gap-2">
            <label
              htmlFor="file"
              className=" text-white/70 hover:text-white hover:bg-white/8 p-1.5 rounded-full cursor-pointer flex items-center justify-center"
            >
              <input type="file" id="file" hidden />
              <Upload size={18} />
            </label>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="flex items-center justify-center p-1.5 text-white/70 rounded-full  hover:text-white hover:bg-white/8 cursor-pointer"
              >
                <MicIcon size={18} />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex items-center justify-center p-1.5 rounded-full bg-zinc-200 text-black hover:bg-white disabled:opacity-40 cursor-pointer"
              >
                {loading ? (
                  <Loader2Icon size={18} className="animate-spin" />
                ) : (
                  <ArrowRightIcon size={18} />
                )}
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1.5 rounded-4xl border border-zinc-800 bg-white/3 p-1.5 backdrop-blur-xl transition-all"
    >
      <label
        htmlFor="file"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
      >
        <input type="file" id="file" hidden />
        <Plus size={18} />
      </label>

      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask OCTO..."
        disabled={loading}
        rows={1}
        className="min-h-7 flex-1 resize-none overflow-hidden border-none bg-transparent py-1 text-sm leading-5 text-white/90 outline-none placeholder:text-zinc-500 disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={!input.trim() || loading}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? (
          <Loader2Icon size={15} className="animate-spin" />
        ) : (
          <ArrowRightIcon size={15} />
        )}
      </button>
    </form>
  );
}
