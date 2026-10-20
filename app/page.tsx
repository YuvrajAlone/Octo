"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import StructureFlow from "../app/components/StructureFlow";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main>
      <div
        className="fixed inset-y-0 right-0 z-50 w-[20vw]"
        onMouseEnter={showButton}
        onFocus={showButton}
      >
        <div
          className={`absolute right-0 top-[30%] flex -translate-y-1/2 flex-col items-end transition-transform duration-300 ease-out ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {isLoaded && isSignedIn && (
            <button type="button" className="px-6 py-2 text-xs text-white">
              <span className="px-6 py-2 text-xs text-white/50 hover:text-white/70" />
              Recents
            </button>
          )}
          <SignInButton mode="modal">
            <button
              type="button"
              className="px-6 py-2 text-xs text-white/50 hover:text-white/70"
            >
              Log in
              <span className="mr-2 text-zinc-500">—</span>
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button
              type="button"
              className="px-6 py-2 text-xs text-white/50 hover:text-white/70"
            >
              Sign up
              <span className="mr-2 text-zinc-500">—</span>
            </button>
          </SignUpButton>
        </div>
      </div>
      <h1 className="fixed top-6 left-1/2 -translate-x-1/2 z-40 text-3xl font-semibold tracking-[0.25em] text-white">
        OCTO
      </h1>
      <StructureFlow />
    </main>
  );
}
