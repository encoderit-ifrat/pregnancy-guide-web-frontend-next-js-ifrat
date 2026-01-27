"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "../_types/forgot_password_types";

import {Button} from "@/components/ui/Button";
import {CircleIcon} from "@/components/ui/CircleIcon";
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
import {Input} from "@/components/ui/Input";
import Header from "@/components/ui/SectionHeader";
import {useForgotPassword} from "../_api/useForgotPassword";
import {toast} from "sonner";

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
            className="w-full max-w-lg p-6 lg:p-10 pt-14 bg-soft-white rounded-2xl"
        >
          {/* Title + Description */}
          <Header
              title="Forgot Password"
              description="Curabitur id mauris laoreet nulla semper posuere eu eu dui. Praesent faucibus, elit a euismod rhoncus."
          />

          {/* Email Field */}
          <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                  <FormItem className="mb-7">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="User Email"
                            variant="default"
                            {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage/>
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
