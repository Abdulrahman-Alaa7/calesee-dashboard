"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "./useUser";
import MainLoading from "../components/ui/main-loading";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function UserProtected({ children }: ProtectedProps) {
  const { user, loading: userLoading, error } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (userLoading) {
        return;
      }

      if (user) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else if (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [user, userLoading, error]);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center mx-auto my-12 flex-col gap-3">
        <MainLoading />
        <p className="font-semibold">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
