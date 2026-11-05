"use client";

import { useAppContext } from "@/src/context/AppContext";
import { useParams } from "next/navigation";
import { Loader, MessageCircle, Folders } from "lucide-react";
import WorkspaceHeader from "@/src/components/WorkspaceHeader";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { exportProjectZip } from "@/src/utils/exportProject";
import ChatPanel from "@/src/components/ChatPanel";
import FileExplorer from "@/src/components/FileExplorer";
// import { Group, Panel, Separator } from "react-resizable-panels";

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
      ></WorkspaceHeader>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-87.5 shrink-0 flex flex-col min-h-0 ">
          {/* border-r border-zinc-900 */}
          {/* Sidebar Tabs */}
          <div className="flex">
            <button
              onClick={() => setLeftTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium cursor-pointer ${leftTab === "chat" ? "text-zinc-300 " : "text-zinc-700 hover:text-zinc-300"}`}
            >
              <MessageCircle size={13} /> Chat
            </button>

            <button
              onClick={() => setLeftTab("files")}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium cursor-pointer ${leftTab === "files" ? "text-zinc-300 " : "text-zinc-700 hover:text-zinc-300"}`}
            >
              <Folders size={13} /> Files
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="min-h-0 flex-1 overflow-hidden">
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
      </div>
    </div>
  );
}
