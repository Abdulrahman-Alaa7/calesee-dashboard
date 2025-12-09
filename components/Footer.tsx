import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div
      className={`text-center p-4 relative overflow-hidden dark:bg-background`}
    >
      <div
        className={`py-4 px-6 rounded-full bg-[#fff] dark:bg-background w-fit mx-auto border border-[#ccc] dark:border-[#9e9e9e29] text-[12px] 500px:text-[16px]`}
      >
        copyright &copy; {new Date().getFullYear()},{" "}
        <span className="font-bold">Calesee.</span> All Rights Reserved
      </div>
    </div>
  );
};

export default Footer;
