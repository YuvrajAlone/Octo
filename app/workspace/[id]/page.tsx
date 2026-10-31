"use client";

import { useAppContext } from "@/app/context/AppContext";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import WorkspaceHeader from "../../components/WorkspaceHeader";
import { useEffect } from "react";
import { Suspense } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { exportProjectZip } from "@/app/utils/exportProject";

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
  } = useAppContext();

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
    <div className="min-h-screen w-full ">
      <WorkspaceHeader
        projectName={activeProject.name}
        showCode={showCode}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onDownload={handleDownload}
      ></WorkspaceHeader>
    </div>
  );
}
