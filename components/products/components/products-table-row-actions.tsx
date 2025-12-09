"use client";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import { AlertModal } from "../../ui/alert-modal";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import {
  DELETE_PRODUCT,
  GET_PRODUCTS_ADMIN,
} from "@/graphql/actions/products/adminProducts";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<any>) {
  const [deleteProduct, { loading: deleteOrderLoading }] =
    useMutation(DELETE_PRODUCT);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onConfirm = async () => {
    try {
      const deleteProductId: any = {
        id: row.original.id,
      };

      await deleteProduct({
        variables: deleteProductId,
        refetchQueries: [{ query: GET_PRODUCTS_ADMIN }],
      });
      toast.success("Product deleted successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={deleteOrderLoading}
      />
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        onClick={() => setOpen(true)}
      >
        <Trash2 color="red" size={20} />
      </Button>
    </>
  );
}
