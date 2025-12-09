"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { GET_TOTAL_ORDERS_FOR_SIX_MONTH } from "../../graphql/actions/queries/analysis/getTotalOrdersForSixMonth";
import MainLoading from "../../components/ui/main-loading";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function AreaGraph() {
  const { data, loading } = useQuery(GET_TOTAL_ORDERS_FOR_SIX_MONTH);

  const chartData: any[] = data
    ? data?.getTotalOrdersForLastSixMonthsAnalytics?.chartData
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Orders</CardTitle>
        <CardDescription>
          Showing total orders for the last 6 months
        </CardDescription>
      </CardHeader>
      {loading ? (
        <div className="flex justify-center items-center mx-auto my-12">
          <MainLoading />
        </div>
      ) : (
        <>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[310px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="total"
                  type="natural"
                  fill="var(--color-total)"
                  fillOpacity={0.4}
                  stroke="var(--color-total)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
      <CardFooter></CardFooter>
    </Card>
  );
}
