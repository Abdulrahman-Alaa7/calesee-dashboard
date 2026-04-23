"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AlertModal } from "../../ui/alert-modal";
import MainLoading from "../../ui/main-loading";

import { Trash2, CircleDotDashed } from "lucide-react";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

import { GET_ORDER_BY_ID } from "../../../graphql/actions/queries/orders/getOrderById";
import { GET_SETTINGS } from "../../../graphql/actions/queries/settings/getSettings";
import { GET_SHIPPING_PRICE } from "../../../graphql/actions/queries/settings/getShippingPrice";
import { GET_ORDERS } from "../../../graphql/actions/queries/orders/getOrders";
import { DELETE_ORDER } from "../../../graphql/actions/mutations/orders/deleteOrder";
import { UPDATE_ORDER } from "../../../graphql/actions/mutations/orders/updateOrder";

type Props = {
  id: string;
};

const statusSchema = z.object({
  status: z.enum(["InProgress", "Canceled", "Pending", "Done"]),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const ViewOrder: FC<Props> = ({ id }) => {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading: getOrderByIdLoading } = useQuery(GET_ORDER_BY_ID, {
    variables: { id },
  });

  const { loading: settingsLoading, data: settingsData } =
    useQuery(GET_SETTINGS);

  const [deleteOrder, { loading: deleteOrderLoading }] = useMutation(
    DELETE_ORDER,
    {
      refetchQueries: [{ query: GET_ORDERS }],
    },
  );

  const [updateOrderStatus, { loading: updateOrderLoading }] = useMutation(
    UPDATE_ORDER,
    {
      refetchQueries: [{ query: GET_ORDERS }],
    },
  );

  const viewData = data?.getOrderById;
  const orderItems = useMemo(
    () => data?.getOrderById?.items ?? [],
    [data?.getOrderById?.items],
  );

  const defaultShippingPrice: number =
    settingsData?.getSettings?.[0]?.defaultShippingPrice ?? 0;
  const freeShippingPrice: number =
    settingsData?.getSettings?.[0]?.freeShippingPrice ??
    Number.MAX_SAFE_INTEGER;

  const [fetchShippingPrice, { data: shippingPriceData }] =
    useLazyQuery(GET_SHIPPING_PRICE);

  useEffect(() => {
    if (viewData?.governorate) {
      fetchShippingPrice({ variables: { governorate: viewData.governorate } });
    }
  }, [viewData?.governorate, fetchShippingPrice]);

  const shippingPrice: number =
    shippingPriceData?.getShippingPrice?.price ?? defaultShippingPrice;

  const calculateFallbackTotal = (items: any[]) => {
    return items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
  };

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: viewData?.status ?? "Pending",
    },
  });

  useEffect(() => {
    if (viewData?.status) {
      form.reset({
        status: viewData.status,
      });
    }
  }, [viewData?.status, form, getOrderByIdLoading]);

  const formatPhoneNumber = (phoneNumber?: string | null) => {
    if (!phoneNumber) return "-";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]}`;
    return phoneNumber;
  };

  const handleDelete = async () => {
    try {
      await deleteOrder({
        variables: { id },
      });
      toast.success("Order deleted successfully");
      setDeleteDialogOpen(false);
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete order");
    }
  };

  const onSubmit = async (data: z.infer<typeof statusSchema>) => {
    try {
      await updateOrderStatus({
        variables: {
          input: {
            id,
            status: data.status,
          },
        },
        refetchQueries: [{ query: GET_ORDERS }],
      });

      toast.success("Order's Status updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isLoading = getOrderByIdLoading;

  const rawTotalPrice = Number(viewData?.totalPrice);
  const rawShippingPrice = Number(viewData?.shippingPrice);

  const fallbackTotal = calculateFallbackTotal(orderItems);

  const hasValidBackendPrice = !isNaN(rawTotalPrice) && rawTotalPrice > 0;

  const finalTotal = hasValidBackendPrice ? rawTotalPrice : fallbackTotal;

  const finalShipping = hasValidBackendPrice ? rawShippingPrice : null;

  return (
    <div className="flex-1 pt-4 pb-8">
      <AlertModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        loading={deleteOrderLoading}
      />

      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-2 md:px-0 animate-[fadeIn_0.4s_ease-out]">
        <section className="rounded-2xl border bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <h2 className="mx-auto -translate-y-4 w-fit rounded-full bg-muted px-6 py-2 text-center text-base font-semibold md:text-lg shadow-sm">
            Shipping Information &amp; Contact
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <MainLoading />
            </div>
          ) : (
            <ScrollArea className="mx-auto w-full border-t px-2 pt-3 pb-1 animate-[softSlideIn_0.4s_ease-out]">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px] border-r text-center font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <InfoRow label="Full Name">
                    {viewData?.fullName ?? "-"}
                  </InfoRow>

                  <InfoRow label="Phone Number">
                    {formatPhoneNumber(viewData?.phone_number)}
                  </InfoRow>

                  {viewData?.secPhone_number && (
                    <InfoRow
                      changeColor
                      label="Sec Phone Number"
                      variant="outline"
                    >
                      {formatPhoneNumber(viewData?.secPhone_number)}
                    </InfoRow>
                  )}

                  <InfoRow label="Email">{viewData?.email ?? "-"}</InfoRow>

                  <InfoRow label="Governorate">
                    {viewData?.governorate ?? "-"}
                  </InfoRow>

                  <InfoRow label="City">{viewData?.city ?? "-"}</InfoRow>

                  <InfoRow label="Address">{viewData?.address ?? "-"}</InfoRow>

                  {viewData?.secAddress && (
                    <InfoRow changeColor label="Sec Address" variant="outline">
                      {viewData?.secAddress}
                    </InfoRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </section>

        {!isLoading && (
          <>
            <div className="relative flex items-center">
              <Separator className="flex-1 opacity-60" />
              <span className="mx-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Order
              </span>
              <Separator className="flex-1 opacity-60" />
            </div>

            <section className="rounded-2xl border bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <h2 className="mx-auto -translate-y-4 w-fit rounded-full bg-muted px-6 py-2 text-center text-base font-semibold md:text-lg shadow-sm">
                Order Details
              </h2>
              <ScrollArea className="mx-auto w-full border-t px-2 pt-3 pb-1 animate-[softSlideIn_0.4s_ease-out]">
                <Table className="w-full">
                  <TableCaption className="my-4">
                    A list of this order.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] text-center">
                        Qty
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[130px] text-center">
                        Size &amp; Color
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item: any, index: number) => (
                      <TableRow
                        key={index}
                        className="text-center md:text-left transition-colors duration-200 hover:bg-muted/40"
                      >
                        <TableCell className="flex items-center justify-center">
                          <Badge className="min-w-[2.25rem] justify-center">
                            {item.quantity}
                          </Badge>
                        </TableCell>

                        <TableCell
                          className="font-semibold"
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.name}
                        </TableCell>

                        <TableCell className="flex flex-col items-center gap-1 text-xs md:text-sm">
                          <span>{item.size}</span>
                          {item?.color && (
                            <span className="flex items-center gap-2">
                              <span className="text-[11px] text-muted-foreground">
                                Color
                              </span>
                              <span
                                className="h-5 w-5 rounded-full border border-border shadow-inner"
                                style={{ backgroundColor: item.color }}
                              />
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          EGP {item.price * item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow className="font-semibold">
                      <TableCell colSpan={3} className="text-left">
                        Shipping
                      </TableCell>
                      <TableCell className="text-right">
                        {settingsLoading
                          ? "..."
                          : finalShipping && finalShipping > 0
                            ? `EGP ${finalShipping}`
                            : "—"}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-bold">
                      <TableCell colSpan={3} className="text-left">
                        Total
                      </TableCell>
                      <TableCell className="text-right">
                        {settingsLoading ? "..." : `EGP ${finalTotal}`}{" "}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollArea>
            </section>

            {viewData?.note && (
              <section className="mx-auto w-full rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:w-4/5">
                <Badge
                  variant="outline"
                  className="mb-4 mx-auto block w-fit text-sm md:text-base"
                >
                  Note
                </Badge>
                <p className="text-center text-sm leading-relaxed text-muted-foreground md:text-base">
                  {viewData.note}
                </p>
              </section>
            )}

            <div className="relative mt-2 flex items-center">
              <Separator className="flex-1 opacity-60" />
              <span className="mx-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </span>
              <Separator className="flex-1 opacity-60" />
            </div>

            <section className="mx-auto w-full rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:w-4/5">
              <h2 className="mb-4 text-center text-base font-semibold md:text-lg">
                Manage Status
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mx-auto space-y-6 md:w-4/5"
                >
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:scale-[1.01] focus:shadow-sm">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">
                              <div className="flex items-center gap-2">
                                <CircleDotDashed className="h-4 w-4 text-yellow-600" />
                                <span>Pending</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="InProgress">
                              <div className="flex items-center gap-2">
                                <StopwatchIcon className="h-4 w-4 text-blue-600" />
                                <span>In progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Done">
                              <div className="flex items-center gap-2">
                                <CheckCircledIcon className="h-4 w-4 text-green-600" />
                                <span>Done</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Canceled">
                              <div className="flex items-center gap-2">
                                <CrossCircledIcon className="h-4 w-4 text-red-600" />
                                <span>Canceled</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage order&apos;s status here.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="px-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      disabled={updateOrderLoading}
                    >
                      {updateOrderLoading ? <MainLoading /> : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </section>

            <div className="flex justify-center">
              <Button
                variant="destructive"
                className="my-4 w-full max-w-sm rounded-full px-6 py-5 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-md active:translate-y-0"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteOrderLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Order
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

type InfoRowProps = {
  label: string;
  children: React.ReactNode;
  variant?: "default" | "outline";
  changeColor?: boolean;
};

const InfoRow: FC<InfoRowProps> = ({
  label,
  children,
  variant = "default",
  changeColor = false,
}) => {
  return (
    <TableRow className="transition-colors duration-200 hover:bg-muted/40">
      <TableCell className="w-[160px] border-r px-2 font-bold">
        <Badge
          variant={variant}
          className={`mx-auto flex w-[130px] ${
            changeColor ? "!text-primary" : "!text-white"
          } items-center justify-center px-2 text-xs font-bold`}
        >
          {label}
        </Badge>
      </TableCell>
      <TableCell
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        className="px-2 text-center text-xs font-semibold md:text-base"
      >
        {children}
      </TableCell>
    </TableRow>
  );
};

export default ViewOrder;
