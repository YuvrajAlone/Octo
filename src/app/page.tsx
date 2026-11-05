"use client";
import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import StructureFlow from "@/src/components/StructureFlow";
import {
  Loader2Icon,
  ArrowRightIcon,
  FolderOpenIcon,
  Loader,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/src/context/AppContext";
import PromptInput from "@/src/components/PromptInput";

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
  const {
    generatingProject,
    generateWebsite,
    projects,
    getProjects,
    loadingProjects,
    deleteProject,
    loadDeleteProject,
  } = useAppContext();
  const { isSignedIn, isLoaded } = useUser();
  const [visible, setVisible] = useState(false);
  const [recents, setRecents] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState(false);

  const handleGenerate = async (prompt: string) => {
    if (!isLoaded) return false;

    if (!isSignedIn) {
      setLoginMessage(true);
      return false;
    }

    await generateWebsite(prompt);
    return true;
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
        className="fixed inset-y-0 right-0 z-50 w-[15vw]"
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
              onClick={() => {
                setRecents(true);
                getProjects();
              }}
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

        {/* prompt input */}
        <PromptInput
          onSubmit={handleGenerate}
          loading={generatingProject}
          variant="glass"
          loginMessage={loginMessage}
        />

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

      {/* recents */}
      {recents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-[8vh]">
          <div className="absolute inset-0" onClick={() => setRecents(false)} />
          <div className="relative z-10 h-[90vh] w-[45vw] rounded-2xl border border-white/10 bg-white/3 shadow-2xl backdrop-blur-md">
            <div className="relative">
              <h2 className="p-4 pb-2 text-xl text-center text-white mr-2">
                Recents
              </h2>

              <button
                onClick={() => setRecents(false)}
                className="absolute right-6 top-4.5 text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* lists */}
            <div className="h-[80vh] overflow-y-auto px-4 scrollbar-none">
              {loadingProjects ? (
                <div className="flex h-full items-center justify-center">
                  <Loader className="size-7 animate-spin [animation-duration:2s] text-zinc-400" />
                </div>
              ) : projects.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className=" flex size-10 items-center justify-center ">
                    <FolderOpenIcon className="size-6 text-zinc-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-200">
                    No projects yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Your recents will appear here.
                  </p>

                  <button
                    onClick={() => setRecents(false)}
                    className="mt-2 text-sm text-zinc-500 underline underline-offset-4 transition-colors hover:text-zinc-300/70 cursor-pointer"
                  >
                    Let's begin !
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      onClick={() => {
                        router.push(`/workspace/${project.id}`);
                        setRecents(false);
                      }}
                      key={project.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-zinc-900/70 p-4 backdrop-blur-xl transition hover:bg-zinc-800/80 hover:border-white/10 cursor-pointer"
                    >
                      <h3 className="truncate text-sm font-medium text-zinc-100">
                        {project.name}
                      </h3>

                      <div className="flex shrink-0 items-center gap-3">
                        {loadDeleteProject === project.id ? (
                          <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal(project.id);
                            }}
                            className="flex size-5 cursor-pointer items-center justify-center text-zinc-500 transition hover:text-red-400"
                            aria-label={`Delete ${project.name}`}
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/workspace/${project.id}`);
                            setRecents(false);
                          }}
                          className="flex size-5 items-center justify-cente text-zinc-300 cursor-pointer "
                          aria-label={`Open ${project.name}`}
                        >
                          <ArrowRightIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* delete */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setDeleteModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium text-white">Delete project?</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Are you sure you want to delete{" "}
              <span className="text-zinc-200">
                {projects.find((project) => project.id === deleteModal)?.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="rounded-4xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  setDeleteModal(null);
                  await deleteProject(deleteModal);
                }}
                disabled={loadDeleteProject === deleteModal}
                className="rounded-4xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <StructureFlow />
    </main>
  );
}
