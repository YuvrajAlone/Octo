"use client";

import { useAppContext } from "@/src/context/AppContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { detectDependencies } from "@/src/utils/sandpackUtils";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import SandpackErrorMonitor from "@/src/components/SandpackErrorMonitor";

type SandpackFiles = Record<string, { code: string }>;

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loader />}>
        <Preview />
      </Suspense>
    </ProtectedRoute>
  );
}

function Preview() {
  const { id } = useParams<{ id: string }>();
  const { activeProject, loadingActiveProject, loadProject } = useAppContext();
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const sandpackFiles = useMemo<SandpackFiles>(() => {
    if (!activeProject?.files) return {};

    const spFiles: SandpackFiles = {};

    for (const [path, content] of Object.entries(activeProject.files)) {
      spFiles[path] = {
        code: typeof content === "string" ? content : (content.content ?? ""),
      };
    }

    return spFiles;
  }, [activeProject?.files]);

  const dependencies = useMemo(() => {
    const files: Record<string, string> = {};

    for (const [path, content] of Object.entries(activeProject?.files ?? {})) {
      files[path] =
        typeof content === "string" ? content : (content.content ?? "");
    }

    return detectDependencies(files);
  }, [activeProject?.files]);

  if (loadingActiveProject || !activeProject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <Loader className="animate-spin [animation-duration:2s]" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen  bg-[#09090b]  overflow-hidden">
      <SandpackProvider
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          logLevel: 0,
        }}
        style={{ height: "100%" }}
      >
        <SandpackErrorMonitor onErrorChange={setShowErrorOverlay} />
        <SandpackLayout className="h-full w-full border-none! bg-transparent!">
          <SandpackPreview
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{ height: "100%" }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
