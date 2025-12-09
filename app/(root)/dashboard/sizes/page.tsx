"use client";
import React from "react";
import Heading from "../../../utils/Heading";
import BreadCrumb from "../../../../components/ui/Breadcrumb";
import PageContainer from "../../../../components/ui/page-container";
import AllSizes from "@/components/sizes/AllSizes";

type Props = {};

const breadcrumbItems = [{ title: "Sizes", link: "/dashboard/sizes" }];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee | Sizes" description="" keywords="" />

      <div className="fadeIn flex-1 space-y-4 ">
        <BreadCrumb items={breadcrumbItems} />
        <AllSizes />
      </div>
    </PageContainer>
  );
};

export default Page;
