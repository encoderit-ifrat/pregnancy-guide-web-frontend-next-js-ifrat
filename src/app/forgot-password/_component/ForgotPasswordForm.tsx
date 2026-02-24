"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "../_types/forgot_password_types";

import { Button } from "@/components/ui/Button";
import { CircleIcon } from "@/components/ui/CircleIcon";
import IconEmail from "@/assets/IconEmail";
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
import { useForgotPassword } from "../_api/useForgotPassword";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import * as React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ForgotPasswordForm() {
  const { t } = useTranslation();

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (values: ForgotPasswordSchemaType) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess(data) {
        toast.success(data?.data?.data?.message);
      },
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-7">
              <FormControl>
                <div className="relative">
                  <Input
                    label={t("forgotPassword.email")}
                    type="email"
                    placeholder={t("forgotPassword.emailPlaceholder")}
                    variant="default"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full uppercase
                     text-sm sm:text-base md:text-lg lg:text-xl 
                     h-11 sm:h-12 md:h-13 lg:h-14
                     leading-none"
          isLoading={forgotPasswordMutation?.isPending}
          disabled={forgotPasswordMutation?.isPending}
        >
          <span>{t("forgotPassword.continueButton")}</span>
          <ChevronRight className="w-8 h-8 ml-1" />
        </Button>
      </form>
    </Form>
  );
}
