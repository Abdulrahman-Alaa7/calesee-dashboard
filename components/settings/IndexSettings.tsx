import React, { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LockSettings from "./LockSettings";
import ChangePassword from "./ChangePassword";
import ShippingZones from "./ShippingZones";

type Props = {};

const IndexSettings: FC<Props> = ({}) => {
  return (
    <div className="mx-auto flex flex-col justify-center items-center">
      <Tabs
        defaultValue="lock"
        className="sm:w-[570px] lg:w-[655px] xl:w-full w-[360px] px-2 mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lock" className="px-2">
            Lock
          </TabsTrigger>
          <TabsTrigger value="shipping" className="px-2">
            Shipping
          </TabsTrigger>
          <TabsTrigger value="password" className="px-2">
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lock">
          <LockSettings />
        </TabsContent>
        <TabsContent value="shipping">
          <ShippingZones />
        </TabsContent>
        <TabsContent value="password">
          <ChangePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndexSettings;
