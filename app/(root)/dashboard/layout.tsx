"use client";

import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import UserProtected from "../../../hooks/userProtected";
import AdminProtected from "../../../hooks/AdminProtected";
import { refreshToken } from "../../../graphql/gql.setup";
import MainLoading from "../../../components/ui/main-loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await refreshToken();
        setIsSessionReady(true);
      } catch (error) {
        window.location.href = "/";
      }
    };
    initializeSession();
  }, []);

  if (!isSessionReady) {
    return (
      <div className="flex justify-center items-center mx-auto my-12 flex-col gap-3">
        <MainLoading />
        <p className="font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <UserProtected>
        <Header />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="w-full pt-16">
            <AdminProtected>{children}</AdminProtected>
          </main>
        </div>
      </UserProtected>
    </>
  );
}
