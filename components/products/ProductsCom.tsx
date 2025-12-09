"use client";
import React from "react";
import BreadCrumb from "../ui/Breadcrumb";
import { DataTable } from "../../components/products/components/products-data-table";
import { columns } from "../../components/products/components/products-columns";
import { HeadPage } from "../ui/HeadPage";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "@apollo/client";
import MainLoading from "../ui/main-loading";
import { GET_PRODUCTS_ADMIN } from "@/graphql/actions/products/adminProducts";

type Props = {};

const ProductsCom = (props: Props) => {
  const breadcrumbItems = [{ title: "Products", link: "/dashboard/products" }];
  const { data, loading } = useQuery(GET_PRODUCTS_ADMIN, {
    fetchPolicy: "network-only",
  });
  const products = data?.getProductsAdmin;

  return (
    <div className="fadeIn flex-1 space-y-4 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <HeadPage
          title={`Products ${loading ? `...` : `(${products?.length})`}`}
          description="Manage products from here"
        />
        <Link
          href={`/dashboard/products/new`}
          className="text-sm flex justify-center items-center shadow-md bg-primary text-white gap-2  w-[140px] h-[40px] rounded-3xl hover:opacity-85 transition-all"
        >
          <Plus size={17} /> Add New
        </Link>
      </div>
      <Separator />

      {loading ? (
        <div className="flex justify-center items-center mx-auto mt-4">
          <MainLoading />
        </div>
      ) : (
        <DataTable data={products} columns={columns} />
      )}
    </div>
  );
};

export default ProductsCom;
