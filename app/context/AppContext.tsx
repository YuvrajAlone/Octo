"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type AppContextType = {
  generatingProject: boolean;
  generateWebsite: (prompt: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [generatingProject, setGeneratingProject] = useState(false);

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

  return (
    <AppContext.Provider
      value={{
        generatingProject,
        generateWebsite,
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
