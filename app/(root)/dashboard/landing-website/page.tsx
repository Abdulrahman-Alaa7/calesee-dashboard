"use client";
import React from "react";
import Heading from "../../../utils/Heading";
import BreadCrumb from "../../../../components/ui/Breadcrumb";
import PageContainer from "../../../../components/ui/page-container";
import AllLandings from "@/components/landing/AllLanding";

type Props = {};

const breadcrumbItems = [
  { title: "Landing Website", link: "/dashboard/landing-website" },
];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee | Landing Website" description="" keywords="" />

      <div className="fadeIn flex-1 space-y-4 ">
        <BreadCrumb items={breadcrumbItems} />
        <AllLandings />
      </div>
    </PageContainer>
  );
};

export default Page;
