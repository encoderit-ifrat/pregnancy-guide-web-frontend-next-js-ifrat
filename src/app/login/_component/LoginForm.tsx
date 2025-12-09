"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "../_types/login_types";

import { Button } from "@/components/ui/Button";
import { CircleIcon } from "@/components/ui/CircleIcon";
import IconPerson from "@/assets/IconPerson";
import IconEmail from "@/assets/IconEmail";
import IconLock from "@/assets/IconLock";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { CheckBox } from "@/components/ui/Checkbox";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import { loginRequestType, useLogin } from "../_api/mutations/useLogin";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const router = useRouter();
  const { update } = useSession();

  const currentUser = useCurrentUser();

  const loginMutation = useLogin();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    const loginRequestData: loginRequestType = {
      email: data?.email,
      password: data?.password,
      remember: data?.acceptTerms,
    };
    loginMutation.mutate(loginRequestData, {
      onSuccess: async (data) => {
        if (data?.data?.data?.access_token) {
          const result = await signIn("credentials", {
            redirect: false,
            token: data?.data?.data?.access_token,
            callbackUrl: "/pregnancy-overview",
          });
          if (result?.error) {
            setLoading(false);
          } else if (result?.ok) {
            setLoading(false);
            await update();
            await currentUser.refetch();
            toast.success("Logged in Successfully");
            window.location.href = "/pregnancy-overview";
          }
        }
      },
      onError(error) {
        setLoading(false);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg
                   px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:p-10 lg:pt-14
                   bg-soft-white rounded-xl sm:rounded-2xl shadow-md
                   min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-auto"
      >
        {/* Top Icon */}
        <CircleIcon
          className="mx-auto mb-3 sm:mb-4 
                               w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-34 lg:h-34"
        >
          <IconPerson className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
        </CircleIcon>

        <div>
          <p
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                        font-semibold text-center text-popover-foreground uppercase
                        pt-4 pb-3 sm:pt-5 sm:pb-4 md:pt-6 md:pb-5 lg:pt-8 lg:pb-8"
          >
            Login
          </p>
        </div>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-3 sm:mb-4 lg:mb-2">
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="User Email"
                    {...field}
                    className="rounded-full pl-12 sm:pl-13 md:pl-14 
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 md:left-6">
                    <IconEmail className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-text-mid" />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-3 sm:mb-4 lg:mb-2">
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                    className="rounded-full pl-12 sm:pl-13 md:pl-14 
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 px-6">
                    <div onClick={() => setShowPassword(!showPassword)}>
                      <IconLock
                        className={`w-5 h-5 ${
                          showPassword ? "text-primary" : "text-gray"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        {/* Checkbox and Forgot Password */}
        <div
          className="flex items-center justify-between 
                        pt-3 pb-5 sm:pt-4 sm:pb-6 md:pt-5 md:pb-7 lg:pt-7 lg:pb-8
                        gap-2 sm:gap-3 md:gap-4"
        >
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <FormControl>
                  <CheckBox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    ref={field.ref}
                    // className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                  />
                </FormControl>
                <FormLabel
                  className="text-xs sm:text-sm md:text-base lg:text-lg 
                                      text-text-dark font-normal whitespace-nowrap 
                                      leading-tight m-0"
                >
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-circle-border hover:underline 
                       text-xs sm:text-sm md:text-base lg:text-xl 
                       whitespace-nowrap leading-tight"
          >
            Forgot password
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full uppercase 
                     text-sm sm:text-base md:text-lg lg:text-xl 
                     h-11 sm:h-12 md:h-13 lg:h-14
                     leading-none"
          isLoading={loading}
          disabled={loading}
        >
          Login
        </Button>

        {/* Sign Up Link */}
        <div
          className="text-xs sm:text-sm md:text-base lg:text-xl 
                        whitespace-nowrap 
                        py-5 sm:py-6 md:py-6 lg:py-7 
                        leading-tight"
        >
          <p className="text-center text-text-dark">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-circle-border hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
