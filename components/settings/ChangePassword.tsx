"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../ui/card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import useUser from "../../hooks/useUser";
import { useMutation } from "@apollo/client";
import { UPDATE_PASSWORD } from "../../graphql/actions/mutations/users/updatePassword";
import MainLoading from "../ui/main-loading";

type Props = {};

const ChangePassword = (props: Props) => {
  const { user } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD);

  const accountSchema = z
    .object({
      currentPassword: z
        .string()
        .min(8, {
          message: `Password must be at least 8 characters`,
        })
        .max(35, {
          message: `The password must not exceed 35 letter`,
        }),
      newPassword: z
        .string()
        .min(8, {
          message: `Password must be at least 8 characters`,
        })
        .max(35, {
          message: `The password must not exceed 35 letter`,
        }),
      confirmPassword: z.string(),
    })
    .refine(
      (values) => {
        return values.newPassword === values.confirmPassword;
      },
      {
        message: `Password must be match`,
        path: ["confirmPassword"],
      }
    );

  type accountValue = z.infer<typeof accountSchema>;

  const form = useForm<accountValue>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<accountValue> = async (data) => {
    try {
      const updatePasswordData = {
        currentPassword: data.currentPassword,
        newPassword: data.confirmPassword,
      };

      await updatePassword({
        variables: updatePasswordData,
      });
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="fadeRight">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your Password from here.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <Label>Email</Label>
        <Input
          placeholder="email@email.com"
          readOnly
          value={user?.email ?? ""}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Separator />
            <div className="flex flex-col gap-3">
              <CardTitle className="flex justify-center items-center mb-3">
                Update your password
              </CardTitle>
              <div className="relative flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="!py-6 pl-4 pr-12"
                            type={!showPassword ? "password" : "text"}
                            placeholder="Current password"
                            {...field}
                            value={field.value ?? ""}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute top-1/2 transform -translate-y-1/2 right-2 z-1 !w-11 !h-11 rounded-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {!showPassword ? (
                              <EyeOff
                                size={75}
                                className={`text-black dark:text-white `}
                              />
                            ) : (
                              <Eye
                                size={75}
                                className={`text-black dark:text-white `}
                              />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="!py-6 pl-4 pr-12"
                            type={!showNewPassword ? "password" : "text"}
                            placeholder="New password"
                            {...field}
                            value={field.value ?? ""}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute top-1/2 transform -translate-y-1/2 right-2 z-1 !w-11 !h-11 rounded-full"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {!showNewPassword ? (
                              <EyeOff
                                size={75}
                                className={`text-black dark:text-white `}
                              />
                            ) : (
                              <Eye
                                size={75}
                                className={`text-black dark:text-white `}
                              />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="!py-6 pl-4 pr-12"
                            type={!showConfirmPassword ? "password" : "text"}
                            placeholder="Confirm password"
                            {...field}
                            value={field.value ?? ""}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute top-1/2 transform -translate-y-1/2 right-2 z-1 !w-11 !h-11 rounded-full"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {!showConfirmPassword ? (
                              <EyeOff
                                size={75}
                                className={`text-black dark:text-white `}
                              />
                            ) : (
                              <Eye
                                size={75}
                                className={`text-black dark:text-white `}
                              />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              className={`flex justify-center items-center mx-auto`}
              disabled={loading}
            >
              {loading ? <MainLoading /> : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
