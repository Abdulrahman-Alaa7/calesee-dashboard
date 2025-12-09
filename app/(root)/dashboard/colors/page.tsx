"use client";
import React from "react";
import Heading from "../../../utils/Heading";
import BreadCrumb from "../../../../components/ui/Breadcrumb";
import PageContainer from "../../../../components/ui/page-container";
import AllColors from "@/components/colors/AllColors";

type Props = {};

const breadcrumbItems = [{ title: "Colors", link: "/dashboard/colors" }];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee | Colors" description="" keywords="" />

      <div className="fadeIn flex-1 space-y-4 ">
        <BreadCrumb items={breadcrumbItems} />
        <AllColors />
      </div>
    </PageContainer>
  );
};

export default Page;
