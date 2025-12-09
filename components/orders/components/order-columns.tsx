"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../data/orderSchema";
import { DataTableColumnHeader } from "./order-table-column-header";
import { DataTableRowActions } from "./order-table-row-actions";
import Act from "./act";
import { statuses } from "../data/orders";
import { Badge } from "../../ui/badge";
import { format } from "timeago.js";
import { GET_SETTINGS } from "../../../graphql/actions/queries/settings/getSettings";
import { useQuery } from "@apollo/client";

const sumPrice = (order: any[]) => {
  let TotalPrice = 0;
  for (let i = 0; i < order.length; i++) {
    TotalPrice += order[i].price * order[i].quantity;
  }
  return TotalPrice;
};

const useThePrice = () => {
  const { loading: settingsLoading, data } = useQuery(GET_SETTINGS);
  const shippingPrice = data?.getSettings[0]?.shippingPrice;
  const freeShippingPrice = data?.getSettings[0]?.freeShippingPrice;
  return { shippingPrice, freeShippingPrice, loading: settingsLoading };
};

const TotalPriceCell = ({ row }: any) => {
  const { shippingPrice, freeShippingPrice, loading } = useThePrice();
  const totalPrice = sumPrice(row.original.items);

  return (
    <div className="flex space-x-2">
      <span className="max-w-[500px] truncate font-medium">
        EGP{" "}
        {loading
          ? "..."
          : `${
              totalPrice > freeShippingPrice
                ? totalPrice
                : totalPrice + shippingPrice
            }`}
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
        (status) => status.value === row.getValue("status")
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
