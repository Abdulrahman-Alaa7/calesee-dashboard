"use client";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { orderShema } from "../data/orderSchema";
import { Trash2 } from "lucide-react";
import { AlertModal } from "../../ui/alert-modal";
import { useMutation } from "@apollo/client";
import { DELETE_ORDER } from "../../../graphql/actions/mutations/orders/deleteOrder";
import { GET_ORDERS } from "../../../graphql/actions/queries/orders/getOrders";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [deleteOrder, { loading: deleteOrderLoading }] =
    useMutation(DELETE_ORDER);

  const order = orderShema?.parse(row.original);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      const deleteOrderId: any = {
        id: order.id,
      };

      await deleteOrder({
        variables: deleteOrderId,
        refetchQueries: [{ query: GET_ORDERS }],
      });
      toast.success("Order deleted successfully");
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
