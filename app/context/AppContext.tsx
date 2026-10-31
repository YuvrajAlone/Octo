"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  description: string;
  version: number;
  status: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  files: Record<string, string | { content?: string }>;
};

type AppContextType = {
  generatingProject: boolean;
  generateWebsite: (prompt: string) => Promise<void>;
  projects: Project[];
  getProjects: () => Promise<void>;
  loadingProjects: boolean;
  loadDeleteProject: string | null;
  deleteProject: (id: string) => Promise<void>;
  activeProject: Project | null;
  activeFile: string;
  setActiveFile: React.Dispatch<React.SetStateAction<string>>;
  loadingActiveProject: boolean;
  loadProject: (id: string, silent?: boolean) => Promise<void>;
  showCode: boolean;
  setShowCode: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [generatingProject, setGeneratingProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadDeleteProject, setLoadDeleteProject] = useState<string | null>(
    null,
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeFile, setActiveFile] = useState("");
  const [loadingActiveProject, setLoadingActiveProject] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const generateWebsite = async (prompt: string) => {
    if (!prompt.trim() || generatingProject) return;

    try {
      setGeneratingProject(true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate website");
      }

      const data: { id: string } = await response.json();

      router.push(`/workspace/${data.id}`);
    } catch (error) {
      console.error("Error generating website:", error);
    } finally {
      setGeneratingProject(false);
    }
  };

  const getProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.error("Error loading recents:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoadDeleteProject(id);

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setLoadDeleteProject(null);
    }
  };

  const loadProject = async (id: string, silent = false) => {
    if (!silent) setLoadingActiveProject(true);

    try {
      const response = await fetch(`/api/projects/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load project");
      }

      const data = await response.json();

      setActiveProject(data);

      const files = Object.keys(data.files ?? {});

      if (files.length > 0) {
        setActiveFile((prev) => {
          if (files.includes(prev)) return prev;
          if (files.includes("/App.js")) return "/App.js";
          return files[0];
        });
      }
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      if (!silent) setLoadingActiveProject(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        generatingProject,
        generateWebsite,
        projects,
        getProjects,
        loadingProjects,
        deleteProject,
        loadDeleteProject,
        activeProject,
        activeFile,
        setActiveFile,
        loadingActiveProject,
        loadProject,
        setShowCode,
        showCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
}
