"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/Form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ChevronDown, Baby, Calendar, User, Weight, Ruler } from "lucide-react";
import { DatePicker } from "../ui/DatePicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { calculateWeeksPregnant } from "@/utlis/calculateWeeksPregnant";
import { calculateWeeksFromDueDate } from "@/utlis/calculateWeeksFromDueDate";
import {
  babyRequestType,
  useBabyCreate,
} from "@/app/profile/_api/mutations/useBabyCreate";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  calculateDueDateFromLPD,
  calculateLPDFromDueDate,
} from "@/utlis/calculateDate";
import {
  BabyProfile,
  FormProfileProps,
} from "@/app/profile/_types.ts/profile_types";
import { toast } from "sonner";
import { useBabyUpdate } from "@/app/profile/_api/mutations/useBabyUpdate";
import {
  ProfileFormSchema,
  ProfileFormSchemaType,
} from "@/app/profile/_types.ts/profile_form_schema";

export default function FormProfile({
  initialData,
  onSubmitForDialogAndRefetch,
}: FormProfileProps) {
  const [profileType, setProfileType] = useState<"upcoming">("upcoming");

  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      babyName: initialData?.name || "",
      gender: (initialData?.gender as "male" | "female" | "other") || undefined,
      dueDate: initialData?.dueDate || "",
      dob: initialData?.dob || "",
      lastPeriodDate: initialData?.lastPeriodDate || "",
      weight: initialData?.weight || "",
      height: initialData?.height || "",
    },
  });

  const genderOptions = [
    { value: "male", label: "Male", icon: "♂" },
    { value: "female", label: "Female", icon: "♀" },
  ];

  const selectedGender = genderOptions.find(
    (g) => g.value === form.watch("gender")
  );

  const { mutate: babyCreate, isPending: babyCreatePending } = useBabyCreate();
  const { mutate: babyUpdate, isPending: babyUpdatePending } = useBabyUpdate(
    initialData?._id || ""
  );

  const isPending = babyCreatePending || babyUpdatePending;

  const onSubmit = (data: ProfileFormSchemaType) => {
    const values: babyRequestType = {
      last_period_date: data.lastPeriodDate || undefined,
      due_date: data.dueDate || undefined,
      upcoming: true,
    };

    const mutate = initialData ? babyUpdate : babyCreate;

    mutate(values, {
      onSuccess: (data) => {
        onSubmitForDialogAndRefetch && onSubmitForDialogAndRefetch();
        toast.success(data?.data?.message);
      },
    });
  };
  const [primarySource, setPrimarySource] = useState<"lpd" | "dd" | null>(null);
  // Track which field was last changed to avoid infinite loops
  const [lastChangedField, setLastChangedField] = React.useState<
    "lpd" | "dd" | null
  >(null);

  // Watch the form values at component level
  const lastPeriodDate = form.watch("lastPeriodDate");
  const dueDate = form.watch("dueDate");
  const { weeks, days } = lastPeriodDate
    ? calculateWeeksPregnant(lastPeriodDate)
    : { weeks: 0, days: 0 };

  // Auto-calculate due date when last period date changes
  useEffect(() => {
    if (lastPeriodDate && lastChangedField === "lpd") {
      const calculatedDueDate = calculateDueDateFromLPD(lastPeriodDate || "");
      form.setValue("dueDate", calculatedDueDate, { shouldValidate: false });
      setPrimarySource("lpd");
      setLastChangedField(null);
    }
  }, [lastPeriodDate, lastChangedField, form]);

  // Auto-calculate last period date when due date changes
  useEffect(() => {
    if (dueDate && lastChangedField === "dd") {
      const calculatedLPD = calculateLPDFromDueDate(dueDate || "");
      form.setValue("lastPeriodDate", calculatedLPD, { shouldValidate: false });
      setPrimarySource("dd");
      setLastChangedField(null);
    }
  }, [dueDate, lastChangedField, form]);

  // Use primarySource to determine which calculation to show
  const pregnancyInfo = useMemo(() => {
    // If primarySource is set, use that to determine the display
    if (primarySource === "lpd" && lastPeriodDate) {
      const { weeks, days } = calculateWeeksPregnant(lastPeriodDate);
      return {
        weeks,
        days,
        source: "lastPeriod",
        message: `You are ${weeks} week${weeks !== 1 ? "s" : ""} ${
          days > 0 ? `and ${days} day${days !== 1 ? "s" : ""}` : ""
        } pregnant! 💕`,
      };
    } else if (primarySource === "dd" && dueDate) {
      const { weeks, days } = calculateWeeksFromDueDate(dueDate);
      return {
        weeks,
        days,
        source: "dueDate",
        message: `You are approximately ${weeks} week${
          weeks !== 1 ? "s" : ""
        } ${
          days > 0 ? `and ${days} day${days !== 1 ? "s" : ""}` : ""
        } pregnant! 💕`,
      };
    }

    // Fallback to default logic if primarySource not set
    if (lastPeriodDate) {
      const { weeks, days } = calculateWeeksPregnant(lastPeriodDate);
      return {
        weeks,
        days,
        source: "lastPeriod",
        message: `You are ${weeks} week${weeks !== 1 ? "s" : ""} ${
          days > 0 ? `and ${days} day${days !== 1 ? "s" : ""}` : ""
        } pregnant! 💕`,
      };
    } else if (dueDate) {
      const { weeks, days } = calculateWeeksFromDueDate(dueDate);
      return {
        weeks,
        days,
        source: "dueDate",
        message: `You are approximately ${weeks} week${
          weeks !== 1 ? "s" : ""
        } ${
          days > 0 ? `and ${days} day${days !== 1 ? "s" : ""}` : ""
        } pregnant! 💕`,
      };
    }
    return null;
  }, [lastPeriodDate, dueDate, primarySource]);
  console.log(`👉 ~ FormProfile ~ pregnancyInfo:`, pregnancyInfo?.weeks);

  useEffect(() => {
    form.reset();
  }, [profileType]);

  return (
    <div className="w-full  md:max-w-md mx-auto bg-soft-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-popover-foreground">
        Create {profileType === "upcoming" ? "Upcoming Baby" : "Newborn"}{" "}
        Profile
      </h2>

      {/* Toggle Profile Type */}
      <div className="flex flex-col md:flex-row gap-3 pb-6">
        <Button
          type="button"
          variant={"tertiary"}
          size="lg"
          className="flex-1 text-base sm:text-lg"
          onClick={() => setProfileType("upcoming")}
        >
          Upcoming Baby
        </Button>
        {/* <Button
          type="button"
          variant={profileType === "newborn" ? "default" : "tertiary"}
          size="lg"
          className="flex-1 text-base sm:text-lg"
          onClick={() => setProfileType("newborn")}
        >
          Newborn
        </Button> */}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Upcoming Baby Fields */}
          {profileType === "upcoming" && (
            <>
              {/* Congratulations Box */}
              {pregnancyInfo && (
                <div className="bg-linear-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-4 sm:p-5 md:p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl sm:text-4xl">🎉</div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-600 mb-2">
                        Congratulations!
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700">
                        {pregnancyInfo.message}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {pregnancyInfo.source === "lastPeriod"
                          ? "Based on your last period date"
                          : "Estimated from your due date"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="lastPeriodDate"
                rules={{ required: "Due date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 md:left-6 z-10 pointer-events-none">
                          <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-text-mid" />
                        </div>
                        <div
                          className="[&_button]:rounded-full [&_button]:pl-12 [&_button]:sm:pl-13 [&_button]:md:pl-14 
                                      [&_button]:h-11 [&_button]:sm:h-12 [&_button]:md:h-13 [&_button]:lg:h-14
                                      [&_button]:text-sm [&_button]:sm:text-base [&_button]:md:text-lg [&_button]:lg:text-xl
                                      [&_button]:text-text-mid [&_button]:!bg-white 
                                      [&_button]:!border [&_button]:!border-input [&_button]:border-solid
                                      [&_button]:w-full [&_button]:justify-start [&_button]:font-normal
                                      [&_button]:hover:!bg-white [&_button]:focus:!bg-white
                                      [&_button>svg]:hidden"
                        >
                          <DatePicker
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(date) => {
                              field.onChange(date?.toISOString());
                              setLastChangedField("lpd");
                            }}
                            placeholder="Last Period Date"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                rules={{ required: "Due date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 md:left-6 z-10 pointer-events-none">
                          <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-text-mid" />
                        </div>
                        <div
                          className="[&_button]:rounded-full [&_button]:pl-12 [&_button]:sm:pl-13 [&_button]:md:pl-14 
                                      [&_button]:h-11 [&_button]:sm:h-12 [&_button]:md:h-13 [&_button]:lg:h-14
                                      [&_button]:text-sm [&_button]:sm:text-base [&_button]:md:text-lg [&_button]:lg:text-xl
                                      [&_button]:text-text-mid [&_button]:!bg-white 
                                      [&_button]:!border [&_button]:!border-input [&_button]:border-solid
                                      [&_button]:w-full [&_button]:justify-start [&_button]:font-normal
                                      [&_button]:hover:!bg-white [&_button]:focus:!bg-white
                                      [&_button>svg]:hidden"
                        >
                          <DatePicker
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(date) => {
                              field.onChange(date?.toISOString());
                              setLastChangedField("dd");
                            }}
                            placeholder="Due Date"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            type="submit"
            size="lg"
            isLoading={isPending}
            disabled={isPending || (pregnancyInfo?.weeks ?? 0) > 42}
            className="w-full text-base sm:text-lg md:text-xl 
                     h-11 sm:h-12 md:h-13 lg:h-14 mt-6"
          >
            Save Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
