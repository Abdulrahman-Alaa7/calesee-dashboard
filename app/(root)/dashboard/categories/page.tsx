"use client";
import React from "react";
import Heading from "../../../utils/Heading";
import BreadCrumb from "../../../../components/ui/Breadcrumb";
import AllCategories from "../../../../components/categories/AllCategories";
import PageContainer from "../../../../components/ui/page-container";

type Props = {};

const breadcrumbItems = [
  { title: "Categories", link: "/dashboard/categories" },
];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee | Categories" description="" keywords="" />

      <div className="fadeIn flex-1 space-y-4 ">
        <BreadCrumb items={breadcrumbItems} />

        <AllCategories />
      </div>
    </PageContainer>
  );
};

export default Page;
