"use client";
import React, { FC, useState } from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import MainLoading from "./ui/main-loading";
import { RESET_PASSWORD } from "../graphql/actions/mutations/users/resetPassword";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../public/assets/logo.png";
type Props = {
  activationToken: string | string[];
};

const ResetPassword: FC<Props> = ({ activationToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false);
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const router = useRouter();

  const ForgotpasswordSchema = z
    .object({
      password: z
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
        return values.password === values.confirmPassword;
      },
      {
        message: `Password must be match`,
        path: ["confirmPassword"],
      }
    );

  type ResetPassword = z.infer<typeof ForgotpasswordSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
    reset,
  } = useForm<ResetPassword>({
    mode: "onChange",
    resolver: zodResolver(ForgotpasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetPassword> = async (data) => {
    try {
      const resetPasswordData = {
        activationToken: activationToken,
        password: data.password,
      };
      await resetPassword({
        variables: resetPasswordData,
      });
      toast.success("Password has been reset successfully");
      reset();
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-[58vh] ">
      <Image
        src={Logo}
        alt="Logo_Snap_Dev"
        width={50}
        height={50}
        className="rounded-full mx-auto"
      />
      <div
        className={`leading-none  1200px:text-[70px] 1100px:text-[60px]  1000px:text-[50px] 800px:text-[45px] 600px:text-[40px] text-[35px] font-bold pt-6 pb-2 gradient-text  text-center tracking-tight`}
      >
        <h1 className={`text-[35px] font-bold mb-3 `}>Reset Password</h1>
      </div>
      <div
        className={`text-muted-foreground w-[90%] 800px:w-[50%] font-[400] mx-auto  pb-3 text-[#666] leading-loose text-[18px] text-center dark:text-[#939db6]`}
      >
        Enter new password
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`relative ${
            errors.password ? "mb-10" : "mb-3"
          }  !w-[350px] 800px:!w-[450px] mx-auto transition-all`}
        >
          <input
            type={!showPassword ? "password" : "text"}
            className={`peer m-0 block h-[60px] w-full rounded-lg border border-solid border-secondary-500 bg-transparent bg-clip-padding pl-3 pr-12 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-twe-primary focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
            id="floatingPassword"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span
              className={`absolute -bottom-7 px-2 text-[14px] text-red-600`}
            >
              {errors.password?.message}
            </span>
          )}
          <label
            htmlFor="floatingPassword"
            className={`pointer-events-none absolute  top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-focus:text-[14px] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
          >
            New Password
          </label>
          <Button
            type="button"
            variant="ghost"
            className={`absolute bottom-1 right-2 z-1 !w-12 !h-12 rounded-full`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? (
              <EyeOff size={75} className={`text-black dark:text-white `} />
            ) : (
              <Eye size={75} className={` text-black dark:text-white `} />
            )}
          </Button>
        </div>
        <div
          className={`relative ${
            errors.confirmPassword ? "mb-10" : "mb-3"
          }  !w-[350px] 800px:!w-[450px] mx-auto transition-all`}
        >
          <input
            type={!confirmPasswordEye ? "password" : "text"}
            className={`peer m-0 block h-[60px] w-full rounded-lg border border-solid border-secondary-500 bg-transparent bg-clip-padding pl-3 pr-12 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-twe-primary focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`}
            id="floatingPassword2"
            placeholder="Password"
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && (
            <span
              className={`absolute -bottom-7 px-2 text-[14px] text-red-600`}
            >
              {errors.confirmPassword?.message}
            </span>
          )}
          <label
            htmlFor="floatingPassword2"
            className={`pointer-events-none absolute  top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-focus:text-[14px] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary`}
          >
            Confirm Password
          </label>
          <Button
            type="button"
            variant="ghost"
            className={`absolute bottom-1 right-2 z-1 !w-12 !h-12 rounded-full`}
            onClick={() => setConfirmPasswordEye(!confirmPasswordEye)}
          >
            {!confirmPasswordEye ? (
              <EyeOff size={75} className={`text-black dark:text-white `} />
            ) : (
              <Eye size={75} className={` text-black dark:text-white `} />
            )}
          </Button>
        </div>
        <Button
          type="submit"
          className={`!w-[350px] 800px:!w-[450px] !rounded-full !z-10 mx-auto mb-3 !py-6 flex justify-center items-center mt-6`}
          disabled={loading}
        >
          {loading ? <MainLoading /> : `Reset Password`}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
