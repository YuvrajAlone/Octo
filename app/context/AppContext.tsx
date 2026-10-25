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
};

type AppContextType = {
  generatingProject: boolean;
  generateWebsite: (prompt: string) => Promise<void>;
  projects: Project[];
  getProjects: () => Promise<void>;
  loadingProjects: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [generatingProject, setGeneratingProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

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

      router.push(`/builder/${data.id}`);
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

  return (
    <AppContext.Provider
      value={{
        generatingProject,
        generateWebsite,
        projects,
        getProjects,
        loadingProjects,
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
