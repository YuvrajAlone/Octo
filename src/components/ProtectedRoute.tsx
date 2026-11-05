"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    redirect("/");
  }

  return children;
}
