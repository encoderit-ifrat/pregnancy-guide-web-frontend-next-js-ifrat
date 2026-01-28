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
import { ChevronRight } from "lucide-react";
import { PasswordInput } from "@/components/base/PasswordInput";

export default function LoginForm() {
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-3 sm:mb-4 lg:mb-2">
              <FormControl>
                <div className="relative">
                  <Input
                    label="Email"
                    placeholder="User Email"
                    {...field}
                  />
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
                <PasswordInput
                  label="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        {/* Checkbox and Forgot Password */}
        <div
          className="flex items-center justify-between
                        pt-3 pb-5 sm:pb-6 md:pb-7 lg:pb-8
                        gap-2 sm:gap-3 md:gap-4"
        >
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex items-center md:gap-2">
                <FormControl>
                  <CheckBox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    ref={field.ref}
                  // className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                  />
                </FormControl>
                <FormLabel
                  className="text-xs text-text-dark font-normal whitespace-nowrap leading-tight m-0"
                >
                  Remember for 30 Days
                </FormLabel>
              </FormItem>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-red-500 hover:underline text-xs whitespace-nowrap leading-tight">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full uppercase text-lg lg:text-xl h-12 leading-none flex"
          isLoading={loading}
          disabled={loading}
        >
          <span>Login</span>
          <ChevronRight className="w-8 h-8 ml-1" />
        </Button>

        <div className="my-6 flex items-center justify-center text-gray-200">
          <div className="w-full h-px bg-gray-200"></div>
          <div className="mx-2">OR</div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Sign Up Link */}
        <div className="whitespace-nowrap leading-tight">
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
