"use client";
import { useQuery } from "@apollo/client";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { GET_RECENT_ORDERS } from "../graphql/actions/queries/analysis/getRecntOrders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import MainLoading from "../components/ui/main-loading";
import { Truck } from "lucide-react";

const calculateFallbackTotal = (items: any[]) => {
  return items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);
};

export function RecentSales() {
  const { data, loading } = useQuery(GET_RECENT_ORDERS);

  const recentOrders = data?.getRecentOrders?.recentOrders;
  const OrdersThisMonth = data?.getRecentOrders?.ordersThisMonthCount;

  function getFirstLetters(fullName: string) {
    const words = fullName.split(" ");
    return words
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join("");
  }

  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          You made{" "}
          {OrdersThisMonth ? (loading ? "..." : `${OrdersThisMonth}`) : "0"}{" "}
          Orders this month.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {recentOrders && loading ? (
            <div className="flex justify-center items-center mx-auto mt-12">
              <MainLoading />
            </div>
          ) : (
            <>
              {recentOrders?.map((order: any, index: number) => {
                console.log(order);

                const rawTotalPrice = Number(order.totalPrice);
                const rawShippingPrice = Number(order.shippingPrice);

                const fallbackTotal = calculateFallbackTotal(order.items);

                const hasValidBackendPrice =
                  !isNaN(rawTotalPrice) && rawTotalPrice > 0;

                const finalTotal = hasValidBackendPrice
                  ? rawTotalPrice
                  : fallbackTotal;

                const finalShipping = hasValidBackendPrice
                  ? rawShippingPrice
                  : null;

                return (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {getFirstLetters(order.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>

                    <div className="ml-6 sm:ml-auto flex flex-col items-end gap-1">
                      <span className="text-[13px] sm:text-[15px] font-bold">
                        LE {finalTotal}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Truck size={13} />
                        {finalShipping && finalShipping > 0
                          ? `LE ${finalShipping}`
                          : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {recentOrders?.length == 0 && (
            <div className="flex justify-center items-center mx-auto mt-12 text-[#ccc]">
              <p>There are not new orders</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
