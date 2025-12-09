import React from "react";
import Heading from "../../../utils/Heading";
import BreadCrumb from "../../../../components/ui/Breadcrumb";
import { HeadPage } from "../../../../components/ui/HeadPage";
import { Separator } from "../../../../components/ui/separator";
import IndexSettings from "../../../../components/settings/IndexSettings";
import PageContainer from "../../../../components/ui/page-container";

type Props = {};

const breadcrumbItems = [{ title: "Settings", link: "/dashboard/settings" }];

const Page = (props: Props) => {
  return (
    <PageContainer scrollable={true}>
      <Heading title="Calesee | Settings" description="" keywords="" />

      <div className="fadeIn flex-1 space-y-4  ">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <HeadPage
            title={`Settings `}
            description="Manage Calesee settings from here"
          />
        </div>
        <Separator />

        <IndexSettings />
      </div>
    </PageContainer>
  );
};

export default Page;
