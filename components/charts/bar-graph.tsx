"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { useQuery } from "@apollo/client";

import { GET_TOTAL_REVENUE_FOR_SIX_MONTH } from "../../graphql/actions/queries/analysis/getTotalRevenueForSixMonth";
import MainLoading from "../../components/ui/main-loading";
const chartConfig = {
  orders: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function BarGraph() {
  const { data, loading } = useQuery(GET_TOTAL_REVENUE_FOR_SIX_MONTH);

  const chartData: any[] = data
    ? data?.getTotalRevenueForLastSixMonthsAnalytics?.chartData
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>
          Showing total revenue for the last 6 months
        </CardDescription>
      </CardHeader>
      {loading ? (
        <div className="flex justify-center items-center mx-auto my-12">
          <MainLoading />
        </div>
      ) : (
        <>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="total" fill="var(--color-orders)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
      <CardFooter></CardFooter>
    </Card>
  );
}
