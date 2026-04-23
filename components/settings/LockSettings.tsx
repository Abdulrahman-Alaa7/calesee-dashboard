"use client";
import React, { useEffect } from "react";
import { Switch } from "../ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SETTINGS } from "../../graphql/actions/queries/settings/getSettings";
import { UPDATE_SETTINGS } from "../../graphql/actions/mutations/settings/updateSettings";
import client from "../../graphql/gql.setup";
import MainLoading from "../ui/main-loading";

const LockSettings = () => {
  const { loading: settingsLoading, data } = useQuery(GET_SETTINGS);
  const [updateSettings, { loading }] = useMutation(UPDATE_SETTINGS);

  const refetchSettingsData = async () => {
    await client.refetchQueries({ include: [GET_SETTINGS] });
  };

  const accountSchema = z.object({
    shippingEn: z
      .string()
      .min(7, { message: "Shipping text must be at least 8 characters" })
      .max(150, { message: "Shipping text must not exceed 150 letters" }),
    shippingAr: z
      .string()
      .min(7, { message: "جملة الشحن العربية لا يجب أن تقل عن 8 أحرف" })
      .max(150, { message: "جملة الشحن العربية لا يجب أن تزيد عن 150 حرفًا" }),
    address: z
      .string()
      .min(3, { message: "Address must be at least 3 characters" })
      .max(150, { message: "Address must not exceed 150 letters" }),
    lock: z.boolean().default(false),
    defaultShippingPrice: z.coerce.number().int().min(0),
    freeShippingPrice: z.coerce.number().int().min(0),
  });

  type AccountValue = z.infer<typeof accountSchema>;

  const form = useForm<AccountValue>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      shippingEn: "",
      shippingAr: "",
      address: "",
      defaultShippingPrice: 0,
      freeShippingPrice: 0,
      lock: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        shippingEn: data?.getSettings[0]?.freeShipDescEn ?? "",
        shippingAr: data?.getSettings[0]?.freeShipDescAr ?? "",
        address: data?.getSettings[0]?.address ?? "",
        defaultShippingPrice: data?.getSettings[0]?.defaultShippingPrice ?? 0,
        freeShippingPrice: data?.getSettings[0]?.freeShippingPrice ?? 0,
        lock: data?.getSettings[0]?.airPlaneMode ?? false,
      });
    }
  }, [data, form]);

  const onSubmit: SubmitHandler<AccountValue> = async (formData) => {
    try {
      await updateSettings({
        variables: {
          id: data?.getSettings[0].id,
          defaultShippingPrice: formData.defaultShippingPrice,
          freeShippingPrice: formData.freeShippingPrice,
          freeShipDescEn: formData.shippingEn,
          freeShipDescAr: formData.shippingAr,
          address: formData.address,
          airPlaneMode: formData.lock,
        },
        refetchQueries: [{ query: GET_SETTINGS }],
      });

      refetchSettingsData();
      toast.success("Settings updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {settingsLoading ? (
        <div className="flex justify-center items-center mx-auto my-12">
          <MainLoading />
        </div>
      ) : (
        <Card className="fadeRight">
          <CardHeader>
            <CardTitle className="text-[18px] md:text-[25px]">
              Lock & Shipping & Address
            </CardTitle>
            <CardDescription>Change settings from here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultShippingPrice"
                    render={({ field }) => (
                      <FormItem className="w-full lg:w-[70%] mx-auto">
                        <FormLabel>Default Shipping Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="55"
                            {...field}
                            value={field.value ?? ""}
                            className="py-6"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Used when no per-governorate price is set.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeShippingPrice"
                    render={({ field }) => (
                      <FormItem className="w-full lg:w-[70%] mx-auto">
                        <FormLabel>Free Shipping Threshold</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="700"
                            {...field}
                            value={field.value ?? ""}
                            className="py-6"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingEn"
                    render={({ field }) => (
                      <FormItem className="w-full lg:w-[70%] mx-auto">
                        <FormLabel>Free Shipping Desc (EN)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Write a Free Shipping Desc"
                            {...field}
                            value={field.value ?? ""}
                            className="py-6"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingAr"
                    render={({ field }) => (
                      <FormItem
                        className="w-full lg:w-[70%] text-right mx-auto"
                        dir="rtl"
                      >
                        <FormLabel className="text-[18px]">وصف الشحن</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="اكتب وصف للشحن المجاني"
                            {...field}
                            value={field.value ?? ""}
                            className="py-6"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="w-full lg:w-[70%] mx-auto">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Write an Address"
                            {...field}
                            value={field.value ?? ""}
                            className="py-6"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lock"
                    render={({ field }) => (
                      <FormItem className="w-full lg:w-[70%] mx-auto flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Airplane mode
                          </FormLabel>
                          <FormDescription className="text-sm">
                            Open or lock receiving orders from here.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  className="mx-auto w-[250px] flex justify-center items-center"
                  type="submit"
                  disabled={loading}
                >
                  Save
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LockSettings;
