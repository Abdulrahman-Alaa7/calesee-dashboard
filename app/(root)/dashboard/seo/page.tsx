"use client";
import React from "react";
import Heading from "../../../utils/Heading";
import BreadCrumb from "../../../../components/ui/Breadcrumb";
import PageContainer from "../../../../components/ui/page-container";
import AllSeo from "@/components/seo/AllSeo";

type Props = {};

const breadcrumbItems = [{ title: "SEO", link: "/dashboard/seo" }];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee | SEO" description="" keywords="" />

      <div className="fadeIn flex-1 space-y-4 ">
        <BreadCrumb items={breadcrumbItems} />
        <AllSeo />
      </div>
    </PageContainer>
  );
};

export default Page;
