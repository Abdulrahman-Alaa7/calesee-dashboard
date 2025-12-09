"use client";
import React, { FC } from "react";
import Heading from "../../../../utils/Heading";
import { HeadPage } from "../../../../../components/ui/HeadPage";
import BreadCrumb from "../../../../../components/ui/Breadcrumb";
import { Separator } from "../../../../../components/ui/separator";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import ProductForm from "../../../../../components/products/ProductForm";
import PageContainer from "../../../../../components/ui/page-container";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID_ADMIN } from "@/graphql/actions/products/adminProducts";
import MainLoading from "@/components/ui/main-loading";

type Props = {
  params: any;
};

const Page: FC<Props> = ({ params }: Props) => {
  const { id }: any = React.use(params);

  const { data, loading: getProductLoading } = useQuery(
    GET_PRODUCT_BY_ID_ADMIN,
    {
      variables: { id: id },
      skip: !id,
    }
  );

  const theProduct = data?.getProductByIdAdmin;

  const breadcrumbItems = [
    { title: "Products", link: "/dashboard/products" },
    { title: "Update Product", link: `/dashboard/products/${id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <Heading title="Update Products | Calesee" description="" keywords="" />
      <ScrollArea className="h-full ">
        <div className={`fadeIn flex-1 space-y-4   `}>
          <div>
            <BreadCrumb items={breadcrumbItems} />
            <HeadPage
              title="Update product"
              description="Update product from here"
            />
          </div>
          <Separator />
          {getProductLoading ? (
            <div className="flex justify-center items-center mx-auto my-6">
              <MainLoading />
            </div>
          ) : (
            <>
              <ProductForm initialProduct={theProduct} />
            </>
          )}
        </div>
      </ScrollArea>
    </PageContainer>
  );
};

export default Page;
