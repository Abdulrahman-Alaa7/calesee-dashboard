"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../data/orderSchema";
import { DataTableColumnHeader } from "./order-table-column-header";
import { DataTableRowActions } from "./order-table-row-actions";
import Act from "./act";
import { statuses } from "../data/orders";
import { Badge } from "../../ui/badge";
import { format } from "timeago.js";
import { Truck } from "lucide-react";

const calculateFallbackTotal = (items: any[]) => {
  return items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);
};

const TotalPriceCell = ({ row }: any) => {
  const totalPrice = Number(row.original.totalPrice) || 0;
  const shippingPrice = Number(row.original.shippingPrice) || 0;

  const fallbackTotal = calculateFallbackTotal(row.original.items);

  const finalTotal = totalPrice > 0 ? totalPrice : fallbackTotal;

  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <span className="max-w-[500px] truncate font-bold border p-2 h-8 rounded-3xl flex justify-center items-center">
        EGP {finalTotal}
      </span>

      <span className="flex items-center gap-1 max-w-[500px] truncate font-medium text-primary border p-2 h-8 rounded-3xl">
        <Truck size={14} />
        <span className="font-bold">
          {shippingPrice > 0 ? `EGP ${shippingPrice}` : "—"}
        </span>
      </span>
    </div>
  );
};
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[40px] line-clamp-1">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity & Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="default"> {row.original.items?.length}</Badge>
          <span className="max-w-[500px] truncate font-medium line-clamp-2">
            {row.getValue("fullName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Total Price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => <TotalPriceCell row={row} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <Badge
          className={`flex w-fit py-[4px]  items-center gap-2  ${
            row.getValue("status") == "Pending" &&
            "bg-yellow-500 hover:bg-yellow-600"
          } ${
            row.getValue("status") == "InProgress" &&
            "bg-blue-500 hover:bg-blue-600"
          } ${
            row.getValue("status") == "Done" &&
            "bg-green-500 hover:bg-green-600"
          } ${
            row.getValue("status") == "Canceled" &&
            "bg-red-500 hover:bg-red-600"
          }`}
        >
          {status.icon && <status.icon className="h-5 w-5 " />}
          <span>{status.label}</span>
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => (
      <div className="w-[110px]">{format(row.getValue("createdAt"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "view",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="View" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Act id={row.getValue("id")} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
