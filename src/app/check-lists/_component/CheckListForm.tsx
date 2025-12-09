"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import {
  ChecklistSchema,
  ChecklistSchemaType,
} from "../_types/checklist_types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
// import { Switch } from "@/components/ui/Switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMutationCreateChecklist } from "../_api/mutations/UseMutationCreateChecklist";
import { Spinner } from "@/components/ui/Spinner";
import { useEffect } from "react";
import { useMutationUpdateChecklist } from "../_api/mutations/UseMutationUpdateChecklist";
type TProps = {
  formData?: {
    type: "default" | "update" | "delete";
    id: string;
    data?: any;
  };
  onSubmitForDialogAndRefetch: () => void;
};

export default function ChecklistForm({
  formData,
  onSubmitForDialogAndRefetch,
}: TProps) {
  useEffect(() => { }, [formData]);
  const { type, data } = formData ?? {};
  const { user, isLoading, isAuthenticated, refetch } = useCurrentUser();

  const last_period_date = user?.details?.last_period_date;
  const current_pregnancy_week = user?.details?.current_pregnancy_week;

  const shouldShowChecklist =
    (last_period_date && last_period_date.trim() !== "") ||
    (current_pregnancy_week && current_pregnancy_week > 0);

  const form = useForm<ChecklistSchemaType>({
    resolver: zodResolver(ChecklistSchema),
    defaultValues:
      type == "update"
        ? data
        : {
          _id: "",
          title: "",
          description: "",
          category: "",
          items: [],
          is_active: true,
        },
  });

  const categoryOptions = [
    {
      label: "General",
      value: "general",
      emoji: "📋",
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Medical",
      value: "medical",
      emoji: "🏥",
      color: "from-red-400 to-red-600",
    },
    {
      label: "Nutrition",
      value: "nutrition",
      emoji: "🥗",
      color: "from-green-400 to-green-600",
    },
    {
      label: "Exercise",
      value: "exercise",
      emoji: "💪",
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "Preparation",
      value: "preparation",
      emoji: "🎒",
      color: "from-amber-400 to-amber-600",
    },
  ];

  const selectedCategory = categoryOptions.find(
    (c) => c.value === form.watch("category")
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const checklistMutation = useMutationCreateChecklist();
  const { mutate: updateChecklist, isPending: isPendingUpdateChecklist } =
    useMutationUpdateChecklist();

  const onSubmit = (values: ChecklistSchemaType) => {
    if (values.items.length === 0) {
      toast.error("Please add at least one checklist item.");
      return;
    }
    if (type === "update") {
      updateChecklist(
        values,

        {
          onSuccess: (data: any) => {
            onSubmitForDialogAndRefetch();
            refetch();
            toast.success(
              data?.data?.message || "Checklist updated successfully!"
            );
            reset();
          },
          // onError: (error: any) => {
          //   toast.error("Something went wrong while saving the checklist.");
          // },
        }
      );
    } else {
      checklistMutation.mutate(
        values,

        {
          onSuccess: (data: any) => {
            onSubmitForDialogAndRefetch();
            refetch();
            toast.success(
              data?.data?.message || "Checklist saved successfully!"
            );
            reset();
          },
          // onError: (error: any) => {
          //   toast.error("Something went wrong while saving the checklist.");
          // },
        }
      );
    }
  };

  if (shouldShowChecklist) {
    return (
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 overflow-hidden  px-4 py-6 bg-soft-white rounded-md shadow-md"
        >
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="rounded-full 
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    {...field}
                    className="rounded-4xl lg:text-xl text-base text-text-mid"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="category"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="w-full bg-light px-4 
                                    flex items-center justify-between
                                    disabled:cursor-not-allowed disabled:opacity-50
                                    rounded-full 
                                    h-11 sm:h-12 md:h-13 lg:h-14
                                    text-sm sm:text-base md:text-lg lg:text-xl 
                                   text-text-mid"
                      >
                        <span className="flex items-center gap-2">
                          {selectedCategory
                            ? selectedCategory.label
                            : "Select Category"}
                        </span>
                        <ChevronDown className="w-5 h-5" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        className="w-full max-w-md"
                      >
                        {categoryOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => field.onChange(option.value)}
                            className="flex items-center gap-2 cursor-pointer rounded-full hover:bg-soft-purple/20 text-text-mid"
                          >
                            <span className="text-sm sm:text-base">
                              {option.emoji} {option.label}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </FormControl>

                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          /> */}

          <div className="space-y-2">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Checklist Items</h3>
              <Button
                type="button"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    // order: fields.length + 1,
                    // is_optional: false,
                  })
                }
                variant="outline"
                size="sm"
                className="hover:text-text-light dark:hover:bg-primary transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>

            {/* Checklist Fields */}
            <div className="max-h-48 overflow-y-auto space-y-3">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="border px-4 py-4 rounded bg-muted/30 "
                >
                  <div className="flex flex-col lg:flex-row md:items-start md:gap-4 space-y-4 md:space-y-4 ">
                    {/* Title */}
                    <FormField
                      control={control}
                      name={`items.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1 w-full">
                          <FormLabel>Item {index + 1} Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Item Title"
                              {...field}
                              className="rounded-full
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-1  w-full">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Description"
                              {...field}
                              className="rounded-full 
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Order */}
                    {/* <FormField
                      control={control}
                      name={`items.${index}.order`}
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              className="rounded-full px-4
                               h-11 sm:h-12 md:h-13 lg:h-14
                               text-sm sm:text-base md:text-lg lg:text-xl 
                               text-text-mid"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* Optional Switch */}
                    {/* <FormField
                      control={control}
                      name={`items.${index}.is_optional`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Optional</FormLabel>
                          <FormControl>
                            <Switch

                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}

                    {/* Remove Button */}

                    <Button
                      type="button"
                      // size="sm"
                      className="my-auto h-11 sm:h-12 md:h-13 lg:h-14 "
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={checklistMutation.isPending || isPendingUpdateChecklist}
            className="w-full max-w-xl"
          >
            {checklistMutation.isPending || isPendingUpdateChecklist ? (
              <Spinner variant="circle" />
            ) : (
              "Save Checklist"
            )}
          </Button>
        </form>
      </Form>
    );
  }
}
