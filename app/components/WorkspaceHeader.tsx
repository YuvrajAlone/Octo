"use client";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  DownloadIcon,
  ExternalLinkIcon,
  Code2Icon,
  EyeIcon,
} from "lucide-react";
import Image from "next/image";

type WorkspaceHeaderProps = {
  projectName: string;
  showCode: boolean;
  onToggleShowCode: (value: boolean) => void;
  onOpenPreview: () => void;
  onDownload: () => void;
};

export default function WorkspaceHeader({
  projectName,
  showCode,
  onToggleShowCode,
  onOpenPreview,
  onDownload,
}: WorkspaceHeaderProps) {
  const router = useRouter();

  return (
    <header className="relative z-40 grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 backdrop-blur-xl">
      {/* Left - Logo & Brand */}
      <button
        onClick={() => router.push("/")}
        className="flex cursor-pointer items-center gap-2"
      >
        <Image
          src="/favicon.ico"
          alt="OCTO"
          width={27}
          height={27}
          unoptimized
          className="aspect-square"
        />
        <span className="text-xl font-semibold tracking-[0.2em] text-white">
          OCTO
        </span>
      </button>

      {/* Center - Project Name */}
      <span className="max-w-64 truncate text-m font-semibold text-zinc-200">
        {projectName}
      </span>

      {/* Right - Actions */}
      <div className="flex shrink-0 items-center justify-self-end gap-2">
        {/* Code / Preview */}
        <button
          onClick={() => onToggleShowCode(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg  px-2 py-1.5 text-xs font-medium text-zinc-400 transition-transform duration-200 hover:scale-110 hover:text-white/80"
        >
          {showCode ? (
            <>
              <EyeIcon size={14} />
              Preview
            </>
          ) : (
            <>
              <Code2Icon size={14} />
              Code
            </>
          )}
        </button>

        {/* Open Preview */}
        <button
          onClick={onOpenPreview}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-400 transition-transform duration-200 hover:scale-110 hover:text-white/80"
        >
          <ExternalLinkIcon size={16} />
          Open Preview
        </button>

        {/* Download */}
        <button
          onClick={onDownload}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg px-2 py-1.5 text-zinc-400 transition-transform duration-200 hover:scale-110 hover:text-white/80"
        >
          <DownloadIcon size={16} />
        </button>

        {/* User */}
        <div className="ml-1 border-l border-white/10 pl-3">
          <div className="translate-y-0.5">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
