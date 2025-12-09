"use client";
import React from "react";
import BreadCrumb from "../ui/Breadcrumb";
import { DataTable } from "../../components/orders/components/order-data-table";
import { columns } from "../../components/orders/components/order-columns";
import { HeadPage } from "../../components/ui/HeadPage";
import { Separator } from "../../components/ui/separator";
import DownloadOrders from "../../components/orders/DownloadOrders";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "../../graphql/actions/queries/orders/getOrders";
import MainLoading from "../ui/main-loading";

type Props = {};

const AllOrdersCom = (props: Props) => {
  const { data, loading } = useQuery(GET_ORDERS);
  const orders = data?.getOrders || [];

  const breadcrumbItems = [{ title: "Orders", link: "/dashboard/orders" }];

  return (
    <div className="fadeIn flex-1 space-y-4 ">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <HeadPage
          title={`Orders (${orders.length})`}
          description="Manage orders from here"
        />
        <DownloadOrders />
      </div>
      <Separator />

      {loading ? (
        <div className="flex justify-center items-center mt-12 mx-auto">
          <MainLoading />
        </div>
      ) : (
        <DataTable data={orders} columns={columns} />
      )}
    </div>
  );
};

export default AllOrdersCom;
