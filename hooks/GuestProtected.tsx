"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "./useUser";
import MainLoading from "../components/ui/main-loading";

interface GuestProtectedProps {
  children: React.ReactNode;
}

export default function GuestProtected({ children }: GuestProtectedProps) {
  const { user, loading, checked, error }: any = useUser();
  const router = useRouter();

  useEffect(() => {
    if (checked && user) {
      router.push("/dashboard");
    }
  }, [checked, user, router]);

  if (!checked) {
    return (
      <div className="flex justify-center items-center mx-auto my-12 flex-col gap-3">
        <MainLoading />
        <p className="font-semibold">Loading...</p>
      </div>
    );
  }

  return !user ? <>{children}</> : null;
}
