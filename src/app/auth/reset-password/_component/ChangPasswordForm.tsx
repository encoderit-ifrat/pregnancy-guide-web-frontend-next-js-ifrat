"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { CircleIcon } from "@/components/ui/CircleIcon";
import IconLock from "@/assets/IconLock";
import IconTick from "@/assets/IconTick";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import Header from "@/components/ui/SectionHeader";
import { useResetPassword } from "../_api/mutations/useResetPassword";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "../_types/change_password_types";

export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { mutate: resetPassword, isPending } = useResetPassword();
  const router = useRouter();

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change to show real-time feedback
  });

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (!urlToken) {
      toast.error("Invalid reset link");
      router.push("/forgot-password");
    } else {
      setToken(urlToken);
    }
  }, [router]);

  const onSubmit = (values: ResetPasswordSchemaType) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }
    resetPassword(
      {
        token,
        password: values.password,
        confirm_password: values.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
          form.reset();
          router.push("/login");
        },
      }
    );
  };

  if (!token) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lg:space-y-2 w-full max-w-lg p-6 lg:p-10 pt-14 bg-soft-white rounded-2xl shadow-md"
      >
        {/* Top Icon */}
        <CircleIcon className="mx-auto mb-4 w-28 h-28 lg:w-34 lg:h-34">
          <IconTick className="w-10 h-10" />
        </CircleIcon>

        {/* Title */}
        <Header
          title="Change Password"
          description="Curabitur id mauris laoreet nulla semper posuere eu eu dui. Praesent
          faucibus, elit a euismod rhoncus."
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...field}
                    className="rounded-full pl-12 sm:pl-13 md:pl-14 
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 px-6">
                    <div
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <IconLock
                        className={`w-5 h-5 ${
                          showConfirmPassword ? "text-primary" : "text-gray"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-11 lg:pt-15 pb-8 lg:pb-15">
          <Button
            type="submit"
            size="lg"
            className="w-full uppercase 
                     text-sm sm:text-base md:text-lg lg:text-xl 
                     h-11 sm:h-12 md:h-13 lg:h-14
                     leading-none"
            disabled={isPending}
            isLoading={isPending}
          >
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
}
