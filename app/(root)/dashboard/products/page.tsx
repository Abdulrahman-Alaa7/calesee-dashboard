import React from "react";
import Heading from "../../../utils/Heading";
import ProductsCom from "../../../../components/products/ProductsCom";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="  fadeIn h-full  p-4 md:px-8">
      <Heading title="Calesee | Products" description="" keywords="" />
      <ProductsCom />
    </div>
  );
};

export default Page;
