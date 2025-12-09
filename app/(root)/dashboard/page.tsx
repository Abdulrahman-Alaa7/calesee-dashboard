import { AreaGraph } from "../../../components/charts/area-graph";
import { BarGraph } from "../../../components/charts/bar-graph";
import PageContainer from "../../../components/ui/page-container";
import { RecentSales } from "../../../components/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Heading from "../../../app/utils/Heading";
import DashboardAnalyticsHead from "../../../components/DashboardAnalyticsHead";

export default function page() {
  return (
    <>
      <Heading title="Caleseet Dashboard" description="" keywords="" />
      <PageContainer scrollable={true}>
        <div className="space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Hi Calesee, Welcome back 👋
            </h2>
          </div>

          <DashboardAnalyticsHead />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <BarGraph />
            </div>

            <RecentSales />

            <div className="col-span-4 md:col-span-7">
              <AreaGraph />
            </div>
            <br />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
