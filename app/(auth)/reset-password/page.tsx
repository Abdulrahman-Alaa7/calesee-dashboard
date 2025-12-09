"use client";
import React, { Suspense } from "react";
import Heading from "../../utils/Heading";
import ResetPassword from "../../../components/ResetPassword";
import Footer from "../../../components/Footer";
import { useSearchParams } from "next/navigation";
import GuestProtected from "../../../hooks/GuestProtected";

type Props = {};

const PageContent = ({}: Props) => {
  const searchParams = useSearchParams();
  const activationToken = searchParams.get("verify") ?? "";
  return (
    <GuestProtected>
      <Heading title="Reset Password | Calesee" description="" keywords="" />
      <div className="flex justify-center items-centerflex  items-center mt-52 mb-12 flex-col">
        <ResetPassword activationToken={activationToken} />
        <Footer />
      </div>
    </GuestProtected>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PageContent />
  </Suspense>
);

export default Page;
