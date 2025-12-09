import React, { FC } from "react";
import Heading from "../../../../utils/Heading";
import ViewOrder from "../../../../../components/orders/components/ViewOrder";
import {
  ScrollArea,
  ScrollBar,
} from "../../../../../components/ui/scroll-area";
import { HeadPage } from "../../../../../components/ui/HeadPage";
import BreadCrumb from "../../../../../components/ui/Breadcrumb";
import { Separator } from "../../../../../components/ui/separator";
import PageContainer from "../../../../../components/ui/page-container";

type Props = {
  params: any;
};

const Page: FC<Props> = ({ params }: Props) => {
  const { id }: any = React.use(params);

  const breadcrumbItems = [
    { title: "Orders", link: "/dashboard/orders" },
    { title: "View Order", link: `/dashboard/order/${id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <ScrollArea className="h-full">
        <div>
          <Heading title="View Order | Calesee" description="" keywords="" />
          <div className={`fadeIn flex-1 space-y-4   `}>
            <div>
              <BreadCrumb items={breadcrumbItems} />
              <HeadPage
                title="View Order"
                description="This is the order's details"
              />
            </div>
            <Separator />

            <ViewOrder id={id} />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </PageContainer>
  );
};

export default Page;
