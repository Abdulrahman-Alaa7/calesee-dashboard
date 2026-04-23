"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "../../graphql/actions/queries/orders/getOrders";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

const DownloadOrders = () => {
  const { data, loading } = useQuery(GET_ORDERS);
  const orders = data?.getOrders || [];

  const handleDownload = () => {
    const pendingOrders = orders.filter(
      (order: any) => order.status === "Pending"
    );

    const formattedData: any[] = [];

    pendingOrders.forEach((order: any, orderIndex: any) => {
      formattedData.push({
        "Order Num": orderIndex + 1,
        "Order ID": order.id,
        "Full Name": order.fullName,
        Email: order.email,
        "Phone Number": order.phone_number,
        Address: order.address,
        Governorate: order.governorate,
        City: order.city,
        "Secondary Address": order.secAddress,
        "Secondary Phone Number": order.secPhone_number,
        Note: order.note,
        Status: order.status,
        "Product Name": "",
        "Product Price": "",
        "Product Quantity": "",
        "Product Size": "",
        "Product Color": "",
      });

      order.items.forEach((product: any, productIndex: any) => {
        formattedData.push({
          "Order ID": "",
          "Full Name": "",
          Email: "",
          "Phone Number": "",
          Address: "",
          Governorate: "",
          City: "",
          "Secondary Address": "",
          "Secondary Phone Number": "",
          Note: "",
          Status: "",
          "Product Name": product.name,
          "Product Price": product.price,
          "Product Quantity": product.quantity,
          "Product Size": product.size,
          "Product Color": product.color,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Orders");

    const columnsWidth = [
      { wch: 10 }, // Order Num.
      { wch: 15 }, // Order ID
      { wch: 20 }, // Full Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone Number
      { wch: 30 }, // Address
      { wch: 15 }, // Governorate
      { wch: 15 }, // City
      { wch: 30 }, // Secondary Address
      { wch: 15 }, // Secondary Phone Number
      { wch: 30 }, // Note
      { wch: 10 }, // Status
      { wch: 20 }, // Product Name
      { wch: 10 }, // Product Price
      { wch: 10 }, // Product Quantity
      { wch: 10 }, // Product Size
      { wch: 10 }, // Product Color
    ];
    worksheet["!cols"] = columnsWidth;

    formattedData.forEach((row, index) => {
      if (row["Order ID"] === "" && row["Product Name"] === "") {
        const cellRef = XLSX.utils.encode_cell({ c: 0, r: index });
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: "FF0000" } },
        };
      }
    });

    XLSX.writeFile(workbook, "pending_orders.xlsx");
  };

  return (
    <Button
      type="button"
      onClick={handleDownload}
      className="text-white text-sm rounded-3xl"
    >
      <Download size={17} className="mr-2" /> Download
    </Button>
  );
};

export default DownloadOrders;
