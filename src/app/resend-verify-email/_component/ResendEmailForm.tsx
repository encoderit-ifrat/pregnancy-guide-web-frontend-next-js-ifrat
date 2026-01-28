"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResendVerifyEmailSchema,
  ResendVerifyEmailSchemaType,
} from "../_types/resend_email_types";

import { Button } from "@/components/ui/Button";
import { CircleIcon } from "@/components/ui/CircleIcon";
import IconEmail from "@/assets/IconEmail";
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
import IconTick from "@/assets/IconTick";
import { useResendEmail } from "../_api/useResendEmail";
import { toast } from "sonner";

export default function ResendEmailForm() {
  const form = useForm<ResendVerifyEmailSchemaType>({
    resolver: zodResolver(ResendVerifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resendEmailMutation = useResendEmail();

  const onSubmit = (values: ResendVerifyEmailSchemaType) => {
    resendEmailMutation.mutate(values, {
      onSuccess(data) {
        toast.success(data?.data?.data?.message);
      },
      onError(error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError?.response?.data?.message ?? "Failed to resend email");
      },
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lg:space-y-2 w-full max-w-[647px] p-6 lg:p-10 pt-14 bg-soft-white rounded-2xl shadow-md"
      >
        {/* Top Icon */}
        <CircleIcon className="mx-auto mb-4 w-28 h-28 lg:w-34 lg:h-34">
          <IconTick className="w-10 h-10" />
        </CircleIcon>

        {/* Title + Description */}
        <Header
          title="Resend Verification Email"
          description="Enter your email address and we'll send you a new verification link to activate your account."
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="User Email"
                    {...field}
                    className="rounded-full pl-14 lg:text-xl text-base text-text-mid"
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 px-6">
                    <IconEmail className="w-5 h-5" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-5 lg:pt-7 pb-8 lg:pb-15">
          <Button
            type="submit"
            isLoading={resendEmailMutation?.isPending}
            disabled={resendEmailMutation?.isPending}
            size="lg"
            className="w-full uppercase text-xl leading-[100%]"
          >
            Resend Verification
          </Button>
        </div>
      </form>
    </Form>
  );
}
