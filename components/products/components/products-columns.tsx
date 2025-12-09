"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../data/productSchema";
import { DataTableColumnHeader } from "./products-table-column-header";
import { DataTableRowActions } from "./products-table-row-actions";
import Act from "./act-products";
import { Badge } from "../../ui/badge";
import Image from "next/image";
import { EyeOffIcon, Gift, ArchiveX } from "lucide-react";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] line-clamp-1">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const images = row.original.images || [];
      const mainImage = images.find((img) => img.isMain) || images[0];

      if (!mainImage) {
        return (
          <div className="w-[55px] h-[55px] rounded-lg bg-slate-100 border border-slate-200" />
        );
      }

      return (
        <div className="relative w-[55px] h-[55px]">
          <Image
            src={mainImage.url}
            alt={row.original.name}
            fill
            className="rounded-lg object-cover object-center"
            sizes="55px"
            priority
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium line-clamp-2 flex gap-1 items-center">
            {row.getValue("name")}
            {row.original.publicPro === false && (
              <EyeOffIcon size={16} color="#e91e63" />
            )}
            {row.original.soldOut && <ArchiveX size={16} color="#e91e63" />}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) {
        return (
          <Badge className="flex w-fit py-[4px] items-center gap-2">
            <span>-</span>
          </Badge>
        );
      }

      return (
        <Badge className="flex w-fit py-[4px] items-center gap-2 text-white">
          <span>
            {category.nameEn} / {category.nameAr}
          </span>
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const categoryId = row.original.category?.id;
      return Array.isArray(value) && categoryId
        ? value.includes(categoryId)
        : false;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.category?.nameEn || "";
      const nameB = rowB.original.category?.nameEn || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "purchased",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchased" />
    ),
    cell: ({ row }) => {
      return (
        <Badge className="flex w-fit py-[4px] items-center gap-2 text-white">
          <span>{row.original.purchased ?? 0}</span>
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue<number>("price");
      const estimatedPrice = row.original.estimatedPrice;
      return (
        <div className="w-[90px]">
          {estimatedPrice && estimatedPrice > 0 ? (
            <div className="flex justify-center items-center gap-1">
              {estimatedPrice} EGP <Gift size={15} className="text-primary " />
            </div>
          ) : (
            `${price} EGP`
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "edit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Edit" />
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
