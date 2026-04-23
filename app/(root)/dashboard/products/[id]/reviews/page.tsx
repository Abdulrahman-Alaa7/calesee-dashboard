"use client";
import React, { FC } from "react";
import Heading from "../../../../../utils/Heading";
import { HeadPage } from "../../../../../../components/ui/HeadPage";
import BreadCrumb from "../../../../../../components/ui/Breadcrumb";
import { Separator } from "../../../../../../components/ui/separator";
import { ScrollArea } from "../../../../../../components/ui/scroll-area";
import PageContainer from "../../../../../../components/ui/page-container";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID_ADMIN } from "@/graphql/actions/products/adminProducts";
import MainLoading from "@/components/ui/main-loading";
import Reviews from "@/components/products/Reviews";
import { GET_REVIEWS_BY_ID } from "@/graphql/actions/queries/reviews/getReviews";

type Props = {
  params: any;
};

const Page: FC<Props> = ({ params }: Props) => {
  const { id }: any = React.use(params);

  const { data, loading: getProductLoading } = useQuery(
    GET_PRODUCT_BY_ID_ADMIN,
    {
      variables: { id: id },
      skip: !id,
    },
  );

  const {
    data: reviewsData,
    loading: getReviewsLoading,
    refetch,
  } = useQuery(GET_REVIEWS_BY_ID, {
    variables: { productId: id },
    skip: !id,
  });

  const theProduct = data?.getProductByIdAdmin;

  const reviews = reviewsData?.getReviewsAdmin;

  const breadcrumbItems = [
    { title: "Products", link: "/dashboard/products" },
    {
      title: theProduct?.name || "Product's Reviews",
      link: `/dashboard/products/${id}/reviews`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <Heading
        title={theProduct ? `Reviews for ${theProduct.name}` : "Reviews"}
        description=""
        keywords=""
      />
      <ScrollArea className="h-full ">
        <div className={`fadeIn flex-1 space-y-4   `}>
          <div className="my-3">
            <BreadCrumb items={breadcrumbItems} />
            <HeadPage
              title={theProduct ? `Reviews for ${theProduct.name}` : "Reviews"}
              description="View and manage reviews for this product from here"
            />
          </div>
          <Separator />
          {getProductLoading ? (
            <div className="flex justify-center items-center mx-auto my-6">
              <MainLoading />
            </div>
          ) : (
            <>
              <Reviews
                theProduct={theProduct}
                reviews={reviews}
                refetch={refetch}
                loading={getReviewsLoading}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </PageContainer>
  );
};

export default Page;
