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
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import {
  ChangePasswordSchema,
  ChangePasswordSchemaType,
} from "../_types/change_password_types";
import { useChangePassword } from "../_api/mutations/useChangePassword";
import {PasswordInput} from "@/components/base/PasswordInput";
import * as React from "react";

export default function UpdatePasswordForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordSchemaType) => {
    changePassword(
      {
        currentPassword: values?.oldPassword,
        newPassword: values?.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          form.reset();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Old Password */}
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                    label="Old Password"
                    {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <PasswordInput
                    label="New Password"
                    {...field}
                />
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
                <PasswordInput
                    label="Confirm New Password"
                    {...field}
                />
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
            // className="w-full uppercase text-xl leading-[100%]"
            className="w-full uppercase 
                     text-sm sm:text-base md:text-lg lg:text-xl 
                     h-11 sm:h-12 md:h-13 lg:h-14
                     leading-none"
            disabled={isPending}
            isLoading={isPending}
          >
            Change Password
          </Button>
        </div>
      </form>
    </Form>
  );
}
