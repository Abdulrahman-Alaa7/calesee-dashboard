"use client";

import React from "react";
import { redirect } from "next/navigation";
import useUser from "./useUser";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useUser();

  if (user) {
    const isAdmin = user?.role === "Admin";
    return isAdmin ? children : redirect("/");
  }
}
