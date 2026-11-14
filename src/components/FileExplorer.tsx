import { FileCodeCorner, FileTextIcon, FolderOpenIcon } from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children: FileNode[];
};

type TreeItemProps = {
  node: FileNode;
  activeFile: string;
  onFileSelect: (path: string) => void;
  depth?: number;
};

type FileExplorerProps = {
  files: Record<string, string | { content?: string }>;
  activeFile: string;
  onFileSelect: (path: string) => void;
};

function buildTree(paths: string[]): FileNode[] {
  const root: FileNode[] = [];

  for (const filePath of [...paths].sort()) {
    const parts = filePath.split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;
      const fullPath = "/" + parts.slice(0, i + 1).join("/");

      let existing = current.find((node) => node.name === name);

      if (!existing) {
        existing = {
          name,
          path: fullPath,
          isDir: !isLast,
          children: [],
        };

        current.push(existing);
      }

      current = existing.children;
    }
  }

  return root;
}

function getFileIcon(name: string): ReactNode {
  if (name.endsWith(".css"))
    return <FileTextIcon size={14} className="text-zinc-400" />;

  if (name.endsWith(".tsx") || name.endsWith(".ts"))
    return <FileCodeCorner size={14} className="text-zinc-400" />;

  if (name.endsWith(".jsx") || name.endsWith(".js"))
    return <FileCodeCorner size={14} className="text-zinc-400" />;

  if (name.endsWith(".json"))
    return <FileTextIcon size={14} className="text-zinc-400" />;

  return <FileTextIcon size={14} className="text-zinc-400" />;
}

function TreeItem({
  node,
  activeFile,
  onFileSelect,
  depth = 0,
}: TreeItemProps) {
  const isActive = node.path === activeFile;

  if (node.isDir) {
    return (
      <div>
        <div
          className="flex items-center gap-2 rounded-md py-1.5 pr-2 text-[12px] font-medium text-zinc-400 select-none"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <FolderOpenIcon size={14} className="shrink-0 text-zinc-500" />
          <span className="truncate capitalize text-zinc-300">{node.name}</span>
        </div>

        {node.children.map((child) => (
          <TreeItem
            key={child.path}
            node={child}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onFileSelect(node.path)}
      title={node.path}
      className={`group relative m-0.5 flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[12px] transition-colors duration-150 ${
        isActive
          ? "bg-white/4 text-white"
          : "text-zinc-400 hover:bg-white/4 hover:text-zinc-200"
      }`}
      style={{ paddingLeft: `${depth * 12 + 12}px` }}
    >
      <span className="shrink-0">{getFileIcon(node.name)}</span>

      <span className="truncate">{node.name}</span>
    </button>
  );
}

const FileExplorer = ({
  files,
  activeFile,
  onFileSelect,
}: FileExplorerProps) => {
  const tree = useMemo(() => buildTree(Object.keys(files)), [files]);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-3 scrollbar-none">
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-300">
          Explorer
        </p>

        <span className="text-[10px] tabular-nums text-zinc-300">
          {Object.keys(files).length} files
        </span>
      </div>

      <div className="flex-1">
        {tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
