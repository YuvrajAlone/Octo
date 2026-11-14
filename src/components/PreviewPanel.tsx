import { useEffect, useState, useMemo, useRef } from "react";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useAppContext } from "../context/AppContext";
import { detectDependencies } from "@/src/utils/sandpackUtils";
import SandpackErrorMonitor from "@/src/components/SandpackErrorMonitor";

type ProjectFiles = Record<string, string | { content?: string }>;

type LiveFiles = Record<string, string>;

type PreviewPanelProps = {
  project: {
    id: string;
    files: ProjectFiles;
  };
  activeFile: string;
  showCode: boolean;
};

type SandpackFileWatcherProps = {
  onLiveFilesChange: (files: LiveFiles) => void;
};

// Watches for file edits inside Sandpack editor and saves changes to DB & live state
function SandpackFileWatcher({ onLiveFilesChange }: SandpackFileWatcherProps) {
  const { sandpack } = useSandpack();
  const { files } = sandpack;
  const { activeProject, updateProjectFiles } = useAppContext();

  const activeProjectRef = useRef(activeProject);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    const project = activeProjectRef.current;
    if (!project) return;
    const updatedFiles: LiveFiles = {};
    let hasChanges = false;

    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode = fileObj.code;
      updatedFiles[path] = fileCode;
      const originalContent =
        typeof project.files[path] === "string"
          ? project.files[path]
          : project.files[path]?.content;
      if (originalContent !== undefined && originalContent !== fileCode) {
        hasChanges = true;
      }
    }

    // Sync live files to parent
    onLiveFilesChange(updatedFiles);
    if (hasChanges) {
      updateProjectFiles(updatedFiles);
    }
  }, [files]);
  return null;
}

const PreviewPanel = ({ project, activeFile, showCode }: PreviewPanelProps) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);
  // Keep local state of files that updates as user types
  const [liveFiles, setLiveFiles] = useState(project.files);
  const [prevProjectKey, setPrevProjectKey] = useState(`${project.id}`);

  const currentKey = `${project.id}`;
  if (prevProjectKey !== currentKey) {
    setPrevProjectKey(currentKey);
    setLiveFiles(project.files);
  }

  const handleLiveFilesChange = (newFiles: LiveFiles) => {
    setLiveFiles((prev) => {
      let changed = false;

      for (const [p, code] of Object.entries(newFiles)) {
        const previousContent =
          typeof prev[p] === "string" ? prev[p] : prev[p]?.content;

        if (previousContent !== code) {
          changed = true;
          break;
        }
      }

      return changed ? newFiles : prev;
    });
  };

  // Convert liveFiles to Sandpack format
  const sandpackFiles = useMemo<
    Record<string, { code: string; active: boolean }>
  >(() => {
    const spFiles: Record<string, { code: string; active: boolean }> = {};

    for (const [path, content] of Object.entries(liveFiles)) {
      const fileCode =
        typeof content === "string" ? content : (content.content ?? "");

      spFiles[path] = {
        code: fileCode,
        active: path === activeFile,
      };
    }

    return spFiles;
  }, [liveFiles, activeFile]);

  // Detect dependencies from import statements using liveFiles
  const dependencies = useMemo(() => {
    const files: Record<string, string> = {};

    for (const [path, content] of Object.entries(liveFiles)) {
      files[path] =
        typeof content === "string" ? content : (content.content ?? "");
    }

    return detectDependencies(files);
  }, [liveFiles]);

  return (
    <div className="flex h-full min-h-0 w-full  overflow-hidden bg-[#09090b]">
      <SandpackProvider
        key={project.id}
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          classes: {
            "sp-wrapper": "sp-wrapper",
            "sp-layout": "sp-layout",
            "sp-preview": "sp-preview",
          },
          logLevel: 0,
        }}
        theme={{
          colors: {
            surface1: "#09090b",
            surface2: "#111113",
            surface3: "#18181b",
            clickable: "#a1a1aa",
            base: "#09090b",
            disabled: "#52525b",
            hover: "white",
            accent: "#e4e4e7",
            error: "#ef4444",
            errorSurface: "#450a0a",
          },
          font: {
            body: "Inter, system-ui, sans-serif",
            mono: "'Geist Mono', ui-monospace, monospace",
            size: "13px",
            lineHeight: "1.6",
          },
        }}
        style={{ width: "100%" }}
      >
        <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />
        <SandpackErrorMonitor onErrorChange={setShowErrorOverlay} />
        <SandpackLayout
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            height: "100%",
            width: "100%",
            minHeight: 0,
            borderRadius: 0,
            background: "#09090b",
            overflow: "hidden",
          }}
        >
          {showCode && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{
                height: "100%",
                flex: showCode ? "0 0 50%" : "0 0 0%",
                minWidth: 0,
              }}
            />
          )}

          <SandpackPreview
            showNavigator={false}
            showRefreshButton
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{
              height: "100%",
              flex: showCode ? "1 1 50%" : "1 1 100%",
              width: showCode ? "50%" : "100%",
              minWidth: 0,
            }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default PreviewPanel;
