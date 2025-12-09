import React from "react";
import MainLoading from "./ui/main-loading";

type Props = {};

const Redirect = (props: Props) => {
  return (
    <div className="flex justify-center items-centerflex  items-center mt-52 mb-12 flex-col gap-4">
      <h1 className={`text-[35px] font-bold  `}>Calesee</h1>
      <MainLoading />
      <p className="">Redirecting...</p>
    </div>
  );
};

export default Redirect;
