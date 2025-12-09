"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DataTableViewOptions } from "./products-table-view-options";
import { DataTableFacetedFilter } from "./products-table-faceted-filter";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../../../graphql/actions/queries/category/getAllCategories";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  dashboard?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  dashboard,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { data, loading } = useQuery(GET_ALL_CATEGORIES);

  const categories = data?.getAllCategories
    ? data.getAllCategories.map((category: any) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-12 w-[250px] "
        />
        {table.getColumn("category") && !loading && categories.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="fadeIn h-12 px-2 lg:px-3"
            disabled={!isFiltered}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
