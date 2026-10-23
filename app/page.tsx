"use client";
import { useEffect, useRef, useState, ComponentProps } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import StructureFlow from "../app/components/StructureFlow";
import {
  CloudUploadIcon,
  Loader2Icon,
  ArrowRightIcon,
  MicIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";

const homeTags = [
  "Portfolio Website",
  "E-commerce Website",
  "Blog",
  "Landing Page",
  "Resume Website",
  "Personal Website",
  "Business Website",
  "Marketing Website",
  "Educational Website",
];

export default function Home() {
  const { generatingProject, generateWebsite } = useAppContext();
  const { isSignedIn, isLoaded } = useUser();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [input, setInput] = useState("");
  const [loginMessage, setLoginMessage] = useState(false);
  const autoFocus = true;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleGenerate = (tag: string) => {
    setInput(tag);
    requestAnimationFrame(() => {
      formRef.current?.requestSubmit();
    });
  };

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setLoginMessage(true);
      setInput("");
      return;
    }

    if (!input.trim() || generatingProject) return;

    await generateWebsite(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  function showButton() {
    setVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 5000);
  }

  useEffect(() => {
    showButton();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* navbar */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-[10vw]"
        onMouseEnter={showButton}
        onFocus={showButton}
      >
        <div
          className={`absolute right-0 top-[30%] flex -translate-y-1/2 flex-col items-end transition-transform duration-300 ease-out ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {isLoaded && isSignedIn && (
            <button
              onClick={() => router.push("/recents")}
              type="button"
              className="flex items-center gap-2 px-6 py-2 text-sm text-white/50 hover:text-white/70 hover:text-left cursor-pointer"
            >
              Recents
              <span className="mr-2 text-zinc-500">—</span>
            </button>
          )}
          {isLoaded && !isSignedIn && (
            <>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2 text-xs text-white/50 hover:text-white/70 cursor-pointer"
                >
                  Log in
                  <span className="mr-2 text-zinc-500">—</span>
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2 text-xs text-white/50 hover:text-white/70 cursor-pointer"
                >
                  Sign up
                  <span className="mr-2 text-zinc-500">—</span>
                </button>
              </SignUpButton>
            </>
          )}
          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-2 px-6 py-2 text-xs text-white/50 hover:text-white/70">
              <UserButton />
              <span className="mr-2 text-zinc-500">—</span>
            </div>
          )}
        </div>
      </div>
      {/* hero */}
      <h1 className="fixed top-6 left-1/2 -translate-x-1/2 z-40 text-3xl font-semibold tracking-[0.25em] text-white">
        OCTO
      </h1>

      <div className="fixed left-1/2 top-[30vh] z-40 w-full -translate-x-1/2 flex flex-col items-center text-center px-4">
        <h2 className="text-6xl font-medium tracking-tight text-white/80">
          Build Websites with AI
        </h2>

        {loginMessage ? (
          <p className="mt-3 text-sm text-white/60">Sign in to begin.</p>
        ) : (
          <p className="mt-3 text-sm text-white/50">
            Describe your idea. OCTO will turn it into a website.
          </p>
        )}
        {/* prompt input */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-5 w-full max-w-2xl bg-white/3 backdrop-blur-xl rounded-xl ring-1 ring-white/10 overflow-hidden transition"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Articulate your vision..."
            disabled={generatingProject}
            rows={2}
            className="w-full p-4 pb-0 resize-none placeholder:text-white/40 outline-none bg-transparent text-white text-base scrollbar-none"
          />

          <div className="flex items-center justify-between pb-3 px-3 gap-2">
            <label
              htmlFor="file"
              className="border border-white/20 text-white/80 hover:text-white hover:border-white/30 p-1.5 rounded-md cursor-pointer flex items-center justify-center"
            >
              <input type="file" id="file" hidden />
              <CloudUploadIcon size={18} />
            </label>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="flex items-center justify-center p-1 text-white/70 hover:text-white cursor-pointer"
              >
                <MicIcon size={18} />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || generatingProject}
                className="flex items-center justify-center p-1.5 rounded-full bg-zinc-200 text-black hover:bg-white disabled:opacity-40 cursor-pointer"
              >
                {generatingProject ? (
                  <Loader2Icon size={18} className="animate-spin" />
                ) : (
                  <ArrowRightIcon size={18} />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Scrolling Marquee tags */}
        <div className="masked-marquee mt-3 w-full max-w-2xl overflow-hidden py-1">
          <div className="animate-marquee flex w-max gap-3">
            {[...homeTags, ...homeTags].map((tag, i) => (
              <button
                key={i}
                onClick={() => handleGenerate(tag)}
                disabled={generatingProject}
                className="shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/20 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StructureFlow />
    </main>
  );
}
