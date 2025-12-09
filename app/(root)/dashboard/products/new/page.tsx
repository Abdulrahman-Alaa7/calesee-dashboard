import React from "react";
import Heading from "../../../../utils/Heading";
import BreadCrumb from "../../../../../components/ui/Breadcrumb";
import { HeadPage } from "../../../../../components/ui/HeadPage";
import { Separator } from "../../../../../components/ui/separator";
import ProductForm from "../../../../../components/products/ProductForm";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import PageContainer from "../../../../../components/ui/page-container";

type Props = {};

const breadcrumbItems = [
  { title: "Products", link: "/dashboard/products" },
  { title: "Add New Product", link: "/dashboard/products/new" },
];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee| Add New Product" description="" keywords="" />
      <ScrollArea className="h-full ">
        <div className="fadeIn flex-1 space-y-4  ">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <HeadPage
              title={`Create New Product`}
              description="Add a new product from here"
            />
          </div>
          <Separator />
          <ProductForm />
        </div>
      </ScrollArea>
    </PageContainer>
  );
};

export default Page;
