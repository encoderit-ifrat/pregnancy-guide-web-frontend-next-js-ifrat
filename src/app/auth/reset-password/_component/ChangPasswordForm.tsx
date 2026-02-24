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
import { PasswordInput } from "@/components/base/PasswordInput";
import * as React from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function ChangePasswordForm() {
  const { t } = useTranslation();
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
    mode: "onChange",
  });

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (!urlToken) {
      toast.error(t("auth.resetPassword.invalidLink"));
      router.push("/forgot-password");
    } else {
      setToken(urlToken);
    }
  }, [router]);

  const onSubmit = (values: ResetPasswordSchemaType) => {
    if (!token) {
      toast.error(t("auth.resetPassword.tokenMissing"));
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
          toast.success(t("auth.resetPassword.success"));
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* New Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput label={t("auth.resetPassword.passwordLabel")} {...field} />
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
              <FormControl>
                <PasswordInput label={t("auth.resetPassword.confirmPasswordLabel")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-10 lg:pt-12">
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
            {t("auth.changePassword.submit")}
          </Button>
        </div>

        <div className="my-6 flex items-center justify-center text-gray-200">
          <div className="w-full h-px bg-gray-200"></div>
          <div className="mx-2">{t("common.or")}</div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Login Link */}
        <div className="text-xs sm:text-sm md:text-base lg:text-xl leading-tight">
          <p className="text-center text-text-dark">
            {t("auth.resetPassword.alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-circle-border hover:underline">
              {t("auth.resetPassword.signIn")}
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
