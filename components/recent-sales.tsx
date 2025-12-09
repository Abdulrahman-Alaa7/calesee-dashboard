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
import { GET_SETTINGS } from "../graphql/actions/queries/settings/getSettings";

export function RecentSales() {
  const { loading: settingsLoading, data: settingsData } =
    useQuery(GET_SETTINGS);
  const shippingPrice = settingsData?.getSettings[0]?.shippingPrice;
  const freeShippingPrice = settingsData?.getSettings[0]?.freeShippingPrice;

  const { data, loading } = useQuery(GET_RECENT_ORDERS);

  const recentOrders = data?.getRecentOrders?.recentOrders;
  const OrdersThisMonth = data?.getRecentOrders?.ordersThisMonthCount;

  const sumPrice = (order: any[]) => {
    let TotalPrice = 0;
    for (let i = 0; i < order.length; i++) {
      TotalPrice += order[i].price * order[i].quantity;
    }
    return TotalPrice;
  };

  function getFirstLetters(fullName: string) {
    const words = fullName.split(" ");

    const firstLetters = words.slice(0, 2).map((word) => word.charAt(0));

    return firstLetters.join("");
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
              {recentOrders?.map((item: any, index: number) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {getFirstLetters(item.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.email}
                    </p>
                  </div>
                  <div className="ml-6 text-[12px] sm:text-[16px] sm:ml-auto font-medium ">
                    LE{" "}
                    {settingsLoading
                      ? "..."
                      : `${
                          sumPrice(item.items) > freeShippingPrice
                            ? sumPrice(item.items)
                            : sumPrice(item.items) + shippingPrice
                        }`}
                  </div>
                </div>
              ))}
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
