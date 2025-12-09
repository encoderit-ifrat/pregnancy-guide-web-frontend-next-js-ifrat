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

export default function ForgotPasswordForm() {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg p-6 lg:p-10 pt-14 bg-soft-white rounded-2xl shadow-md"
      >
        {/* Top Icon */}
        <CircleIcon className="mx-auto mb-4 w-28 h-28 lg:w-34 lg:h-34">
          <IconTick className="w-10 h-10" />
        </CircleIcon>

        {/* Title + Description */}
        <Header
          title="Forgot Password"
          description="Curabitur id mauris laoreet nulla semper posuere eu eu dui. Praesent faucibus, elit a euismod rhoncus."
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-7">
              <FormLabel></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="User Email"
                    {...field}
                    // className="rounded-full pl-14 lg:text-xl text-base text-text-mid"
                    className="rounded-full pl-12 sm:pl-13 md:pl-14 
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
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
        <Button
          type="submit"
          size="lg"
          // className="w-full uppercase text-xl leading-[100%]"
          className="w-full uppercase 
                     text-sm sm:text-base md:text-lg lg:text-xl 
                     h-11 sm:h-12 md:h-13 lg:h-14
                     leading-none"
          isLoading={forgotPasswordMutation?.isPending}
          disabled={forgotPasswordMutation?.isPending}
        >
          Send
        </Button>
      </form>
    </Form>
  );
}
