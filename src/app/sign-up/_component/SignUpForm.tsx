"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "../_types/register_types";
import { Button } from "@/components/ui/Button";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

import Link from "next/link";
import { CheckBox } from "@/components/ui/Checkbox";
import { RegisterFormType, useSignUp } from "../_api/mutations/useSignuUp";
import { toast } from "sonner";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { PasswordInput } from "@/components/base/PasswordInput";
import { useTranslation } from "@/hooks/useTranslation";

export default function RegisterForm() {
  const { t } = useTranslation();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUpMutation = useSignUp();

  const onSubmit = (values: RegisterSchemaType) => {
    const formData: RegisterFormType = {
      name: values?.name,
      email: values?.email,
      password: values?.password,
      confirm_password: values?.confirmPassword,
    };
    signUpMutation.mutate(formData, {
      onSuccess(data) {
        const successMessage = data?.data?.data?.message;
        toast.success(successMessage || t("signUp.registrationSuccess"));
      },
      onError(error: unknown) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          axiosError.response?.data?.message ?? t("signUp.registrationFailed");
        toast.error(errorMessage);
      },
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                <FormControl>
                  <div className="relative">
                    <Input
                      label={t("signUp.userName")}
                      placeholder={t("signUp.userName")}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                <FormControl>
                  <div className="relative">
                    <Input
                      label={t("signUp.userEmail")}
                      placeholder={t("signUp.userEmail")}
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
                    label={t("signUp.password")}
                    placeholder={t("signUp.password")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                <FormControl>
                  <PasswordInput
                    label={t("signUp.confirmPassword")}
                    placeholder={t("signUp.confirmPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Checkbox and Terms */}
        <div className="flex items-start sm:items-center my-8">
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
                  />
                </FormControl>
                <FormLabel className="text-xs sm:text-sm md:text-base lg:text-lg text-text-dark font-normal leading-tight m-0">
                  {t("signUp.termsText")}{" "}
                  <Link
                    href="/terms"
                    className="text-circle-border hover:underline"
                  >
                    {t("signUp.termsLink")}
                  </Link>
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          isLoading={signUpMutation?.isPending}
          disabled={signUpMutation?.isPending}
          className="w-full uppercase
                     text-sm sm:text-base md:text-lg lg:text-xl
                     h-11 sm:h-12 md:h-13 lg:h-14
                     leading-none"
        >
          <span>{t("signUp.signUpButton")}</span>
          <ChevronRight className="w-8 h-8 ml-1" />
        </Button>

        <div className="my-6 flex items-center justify-center text-gray-200">
          <div className="w-full h-px bg-gray-200"></div>
          <div className="mx-2">{t("signUp.or")}</div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Login Link */}
        <div className="leading-tight">
          <p className="text-center text-text-dark">
            {t("signUp.hasAccount")}{" "}
            <Link href="/login" className="text-circle-border hover:underline">
              {t("signUp.signIn")}
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
