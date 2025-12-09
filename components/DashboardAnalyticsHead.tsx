"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaMoneyBillWave } from "react-icons/fa";
import { PackageOpen } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_REVENUE } from "../graphql/actions/queries/analysis/getTotalRevenue";
import { GET_MONTHLY_ORDERS } from "../graphql/actions/queries/analysis/getMonthlyOrders";

const DashboardAnalyticsHead = () => {
  const { data, loading: totalRevenueLoading } = useQuery(GET_TOTAL_REVENUE);
  const { data: OrderCount, loading: orderCountLoading } =
    useQuery(GET_MONTHLY_ORDERS);

  const currentMonthRevenue =
    data?.getTotalRevenueAnalytics?.currentMonthRevenue;
  const lastMonthRevenue = data?.getTotalRevenueAnalytics?.lastMonthRevenue;

  const currentMonthOrders =
    OrderCount?.getMonthlyOrdersCountAnalytics?.currentMonthOrdersCount;
  const lastMonthOrders =
    OrderCount?.getMonthlyOrdersCountAnalytics?.lastMonthOrdersCount;

  function calculatePercentageChange(current: number, previous: number) {
    if (previous === 0) return 100;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  }

  const percentageChange = Number(
    calculatePercentageChange(currentMonthRevenue, lastMonthRevenue)
  );
  const percentageChangeOrders = Number(
    calculatePercentageChange(currentMonthOrders, lastMonthOrders)
  );

  function formatRevenue(amount: number) {
    return amount?.toLocaleString("en-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div>
      {" "}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FaMoneyBillWave className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              EGP{" "}
              {totalRevenueLoading
                ? "..."
                : `${formatRevenue(currentMonthRevenue)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalRevenueLoading
                ? "..."
                : `${
                    percentageChange > 0
                      ? `+${percentageChange}%`
                      : `${percentageChange}%`
                  }`}{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {orderCountLoading ? "..." : `${currentMonthOrders}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {orderCountLoading
                ? "..."
                : `${
                    percentageChangeOrders > 0
                      ? `+${percentageChangeOrders}%`
                      : `${percentageChangeOrders}%`
                  }`}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAnalyticsHead;
