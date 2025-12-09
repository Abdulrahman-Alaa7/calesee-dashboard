"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../graphql/actions/mutations/users/forgotPassword.action";
import MainLoading from "./ui/main-loading";

type Props = {};

const ForgotPassword = (props: Props) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
  const [isOpen, setIsOpen] = useState(false);

  const ForgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: `Email is required`,
      })
      .email({
        message: `Not valid email`,
      }),
  });

  type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
    reset,
  } = useForm<ForgotPassword>({
    mode: "onChange",
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPassword> = async (data) => {
    try {
      await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      toast.success("Please check your email to reset your password!");
      setIsOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          className={`!w-[350px] 800px:!w-[450px] border rounded-full inline-flex items-center justify-center whitespace-nowrap py-6 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-white/90  hover:bg-primary/90 h-10 px-4`}
        >
          Forgot Password ?
        </DialogTrigger>
        <DialogContent className="w-[350px] md:w-[430px] mx-auto !rounded-3xl  transition-all">
          <DialogHeader>
            <DialogTitle>Forgot Password?</DialogTitle>
            <DialogDescription>Enter Your Email</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`relative ${errors.email ? "mb-6" : "mb-3"}  `}>
              <input
                type="email"
                className=" peer m-0 block h-[60px]  w-full rounded-lg border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                id="floatingInput"
                placeholder="name@example.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span
                  className={`absolute -bottom-7 px-2 text-[14px] text-red-600`}
                >
                  {errors.email.message}
                </span>
              )}
              <label
                htmlFor="floatingInput"
                className={`pointer-events-none absolute top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-focus:text-[14px] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
              >
                Email address
              </label>
            </div>
            <Button
              type="submit"
              className={`w-full !rounded-full !z-10 !mx-auto mb-3 !py-6 mt-6`}
              disabled={loading}
            >
              {loading ? <MainLoading /> : `Submit`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
