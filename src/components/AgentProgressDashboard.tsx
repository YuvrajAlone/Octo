import { CheckCircle2Icon, CircleIcon, Loader2Icon } from "lucide-react";

type PlannedFile = {
  path: string;
  description: string;
};

type AgentProgressDashboardProps = {
  project: {
    filesPlanned?: PlannedFile[];
    filesGenerated?: string[];
    currentFile?: string;
    status: string;
    error?: string;
  };
};

export default function AgentProgressDashboard({
  project,
}: AgentProgressDashboardProps) {
  const planned = project.filesPlanned || [];
  const completed = project.filesGenerated || [];
  const current = project.currentFile;
  const isFailed = project.status === "failed";

  return (
    <div className="h-full w-full bg-[#09090b] flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className="max-w-2xl w-full bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Status Header */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              {isFailed
                ? "Generation Failed"
                : project.status === "pending"
                  ? "Planning Architecture..."
                  : "AI Agent is Building..."}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {isFailed
                ? "An error occurred during build"
                : "Writing production-ready React codebase"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {isFailed && project.error && (
          <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg text-sm text-red-400">
            Error: {project.error}
          </div>
        )}

        {/* Progress Bar */}
        {planned.length > 0 && !isFailed && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              <span>Progress</span>
              <span className="text-zinc-300 tabular-nums">
                {Math.round((completed.length / planned.length) * 100)}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-300 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(completed.length / planned.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Files Checklist */}
        {planned.length > 0 ? (
          <div>
            <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              Planned Files ({completed.length}/{planned.length})
            </span>

            <div className="space-y-2.5 max-h-75 overflow-y-auto pr-1">
              {planned.map((file) => {
                const isCompleted = completed.includes(file.path);
                const isGenerating = current === file.path;

                return (
                  <div
                    key={file.path}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      isGenerating
                        ? "bg-zinc-800/40 border-zinc-600/50"
                        : isCompleted
                          ? "bg-zinc-900/40 border-white/5"
                          : "bg-transparent border-white/5 opacity-60"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2Icon
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                    ) : isGenerating ? (
                      <Loader2Icon
                        size={16}
                        className="animate-spin text-zinc-300 shrink-0"
                      />
                    ) : (
                      <CircleIcon
                        size={16}
                        className="text-zinc-600 shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          isGenerating
                            ? "text-zinc-100"
                            : isCompleted
                              ? "text-zinc-300"
                              : "text-zinc-500"
                        }`}
                      >
                        {file.path}
                      </p>

                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {file.description}
                      </p>
                    </div>

                    {isGenerating && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold animate-pulse uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          !isFailed && (
            <div className="flex flex-col items-center justify-center py-6 text-zinc-500 -translate-y-3">
              <Loader2Icon
                size={24}
                className="animate-spin mb-3 text-zinc-400"
              />
              <p className="text-xs text-center">
                Analyzing requirements and designing project structure...
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
