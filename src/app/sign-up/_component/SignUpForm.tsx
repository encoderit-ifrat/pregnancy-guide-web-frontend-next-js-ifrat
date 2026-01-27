"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterSchema, RegisterSchemaType} from "../_types/register_types";
import {AxiosError} from "axios";
import {Button} from "@/components/ui/Button";
import {CircleIcon} from "@/components/ui/CircleIcon";
import IconPerson from "@/assets/IconPerson";
import IconEmail from "@/assets/IconEmail";
import IconLock from "@/assets/IconLock";
import IconPersonPlaceholder from "@/assets/IconPersonPlaceholder";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import {Input} from "@/components/ui/Input";

import Link from "next/link";
import {CheckBox} from "@/components/ui/Checkbox";
import {RegisterFormType, useSignUp} from "../_api/mutations/useSignuUp";
import {toast} from "sonner";
import {useState} from "react";
import * as React from "react";
import {ChevronRight, Eye, EyeOff} from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        toast.success(successMessage || "Registration Successful");
      },
      onError(error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const errorMessage =
            axiosError.response?.data?.message ?? "Registration failed";
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
                render={({field}) => (
                    <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                      <FormControl>
                        <div className="relative">
                          <Input
                              label="User Name"
                              placeholder="User Name"
                              {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm"/>
                    </FormItem>
                )}
            />

            {/* Email Field */}
            <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                      <FormControl>
                        <div className="relative">
                          <Input
                              label="User Email"
                              placeholder="User Email"
                              {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm"/>
                    </FormItem>
                )}
            />

            {/* Password Field */}
            <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                    <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                      <label className="text-lg font-medium text-text-purple">Password</label>
                      <FormControl>
                        <div className="relative">
                          <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...field}
                          />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 px-4 pb-2">
                            <div onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ?
                                  <Eye className={`w-5 h-5 ${showPassword ? "text-primary" : "text-gray"}`}/>
                                  :
                                  <EyeOff className={`w-5 h-5 ${showPassword ? "text-primary" : "text-gray"}`}/>
                              }
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm"/>
                    </FormItem>
                )}
            />

            {/* Confirm Password Field */}
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({field}) => (
                    <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                      <label className="text-lg font-medium text-text-purple">Confirm Password</label>
                      <FormControl>
                        <div className="relative">
                          <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              {...field}
                          />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 px-4 pb-2">
                            <div onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ?
                                  <Eye className={`w-5 h-5 ${showConfirmPassword ? "text-primary" : "text-gray"}`}/>
                                  :
                                  <EyeOff className={`w-5 h-5 ${showConfirmPassword ? "text-primary" : "text-gray"}`}/>
                              }
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm"/>
                    </FormItem>
                )}
            />
          </div>

          {/* Checkbox and Terms */}
          <div
              className="flex items-start sm:items-center my-8">
            <FormField
                control={form.control}
                name="acceptTerms"
                render={({field}) => (
                    <FormItem className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <FormControl>
                        <CheckBox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            ref={field.ref}
                            className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mt-0.5 sm:mt-0"
                        />
                      </FormControl>
                      <FormLabel className="text-xs sm:text-sm md:text-base lg:text-lg text-text-dark font-normal leading-tight m-0">
                        I understood the{" "}
                        <Link
                            href="/terms"
                            className="text-circle-border hover:underline"
                        >
                          terms & policy
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
            <span>Sign Up</span>
            <ChevronRight className="w-8 h-8 ml-1"/>
          </Button>

          {/* Login Link */}
          <div
              className="text-xs sm:text-sm md:text-base lg:text-xl
                        mt-10
                        leading-tight"
          >
            <p className="text-center text-text-dark">
              Already have an account?{" "}
              <Link href="/login" className="text-circle-border hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </Form>
  );
}
