"use client";

import { useAppContext } from "@/src/context/AppContext";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import WorkspaceHeader from "@/src/components/WorkspaceHeader";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { exportProjectZip } from "@/src/utils/exportProject";
import ChatPanel from "@/src/components/ChatPanel";
import FileExplorer from "@/src/components/FileExplorer";
import PreviewPanel from "@/src/components/PreviewPanel";
import AgentProgressDashboard from "@/src/components/AgentProgressDashboard";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loader />}>
        <Workspace />
      </Suspense>
    </ProtectedRoute>
  );
}

function Workspace() {
  const { id } = useParams<{ id: string }>();
  const {
    activeProject,
    loadingActiveProject,
    activeFile,
    setActiveFile,
    showCode,
    setShowCode,
    loadProject,
    chatLoading,
    handleChat,
  } = useAppContext();
  const [leftTab, setLeftTab] = useState("chat");

  useEffect(() => {
    if (!id) return;
    loadProject(id);
  }, [id]);

  const handleOpenPreview = () => {
    if (!id) return;
    window.open(`/preview/${id}`, "_blank");
  };

  const handleDownload = () => {
    if (!activeProject) return;
    exportProjectZip(activeProject);
  };

  if (loadingActiveProject || !activeProject) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin [animation-duration:2s]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <WorkspaceHeader
        projectName={activeProject.name}
        showCode={showCode}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onDownload={handleDownload}
        LeftTab={() =>
          setLeftTab((prev) => (prev === "files" ? "chat" : "files"))
        }
        setActiveFile={setActiveFile}
        appFile={activeProject.files["/App.js"] ? "/App.js" : "/App.ts"}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-87.5 shrink-0 flex flex-col min-h-0 ">
          {/* Sidebar Tabs */}
          <div className="flex border-r border-zinc-800 ">
            <button
              onClick={() => setLeftTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium cursor-pointer ${leftTab === "chat" ? "text-zinc-300 border-b-2 border-zinc-500" : "text-zinc-700 hover:text-zinc-300"}`}
            >
              Chat
            </button>

            <button
              onClick={() => setLeftTab("files")}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium cursor-pointer ${leftTab === "files" ? "text-zinc-300 border-b-2 border-zinc-500" : "text-zinc-700 hover:text-zinc-300"}`}
            >
              Files
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="min-h-0 flex-1 overflow-hidden border-r border-zinc-800">
            {leftTab === "chat" ? (
              <ChatPanel
                messages={activeProject.messages ?? []}
                onSend={handleChat}
                loading={chatLoading}
              />
            ) : (
              <FileExplorer
                files={activeProject.files}
                activeFile={activeFile}
                onFileSelect={(path: string) => {
                  setActiveFile(path);
                  setShowCode(true);
                }}
              />
            )}
          </div>
        </div>

        {/* Preview / Code Area */}
        <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden">
          {activeProject.status === "pending" ||
          activeProject.status === "generating" ||
          activeProject.status === "failed" ? (
            <AgentProgressDashboard project={activeProject} />
          ) : (
            <PreviewPanel
              project={activeProject}
              activeFile={activeFile}
              showCode={showCode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
