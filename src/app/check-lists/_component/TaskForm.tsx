"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/Textarea";
import { CalendarIcon, Bell, Trash2, Save, Loader2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutationCreateItem } from "../_api/mutations/UseMutationCreateItem";
import { useMutationUpdateItem } from "../_api/mutations/UseMutationUpdateItem";
import { useMutationDeleteItem } from "../_api/mutations/UseMutationDeleteItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { useTranslation } from "@/hooks/useTranslation";

// ----------------------
// SCHEMA TYPE
// ----------------------
const getFormSchema = (t: (key: string) => string) => z.object({
  checklist_id: z.string(),
  title: z.string().min(1, t("checklists.taskForm.validation.titleRequired")),
  priority: z.enum(["high", "medium", "low", "none"]),
  assigned_to: z.enum(["none", "me", "partner"]),
  due_date: z.date(),
  description: z.string().optional(),
  reminder: z.boolean().optional(),
});

export type TaskFormValues = z.infer<ReturnType<typeof getFormSchema>>;

// ----------------------
// COMPONENT
// ----------------------
export default function TaskForm({
  onClose,
  checklist_id,
  refetch,
  task,
}: {
  onClose?: () => void;
  checklist_id: string;
  refetch?: () => void;
  task?: any;
}) {
  const { t } = useTranslation();
  const isUpdate = !!task;

  const { mutateAsync: createItem, isPending: isCreatingItem } = useMutationCreateItem();
  const { mutateAsync: updateItem, isPending: isUpdatingItem } = useMutationUpdateItem();
  const { mutateAsync: deleteItem, isPending: isDeletingItem } = useMutationDeleteItem();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formSchema = getFormSchema(t);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checklist_id: checklist_id,
      title: task?.name || "",
      description: task?.description || "",
      priority: task?.priority || "high",
      due_date: task?.date ? new Date(task.date) : new Date(),
      reminder: task?.reminder || false,
      assigned_to: task?.assignedTo || "none",
    },
  });

  function onSubmit(values: TaskFormValues) {
    console.log("Submitting values:", values);

    if (isUpdate) {
      updateItem({ id: task.id, data: values }, {
        onSuccess: () => {
          refetch?.();
          onClose?.();
        },
      });
    } else {
      createItem(values, {
        onSuccess: () => {
          refetch?.();
          onClose?.();
        },
      });
    }
  }

  function handleDelete() {
    setIsDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (!task?.id) return;
    deleteItem(task.id, {
      onSuccess: () => {
        refetch?.();
        onClose?.();
        setIsDeleteDialogOpen(false);
      },
    });
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 bg-white rounded-2xl shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#1B1343]">
                  {t("checklists.taskForm.title")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("checklists.taskForm.titlePlaceholder")}
                    className="border-purple-300 focus-visible:ring-purple-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#1B1343]">
                    {t("checklists.taskForm.priority")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-2"
                    >
                      {[
                        { value: "high", label: t("checklists.taskForm.priorities.high") },
                        { value: "medium", label: t("checklists.taskForm.priorities.medium") },
                        { value: "low", label: t("checklists.taskForm.priorities.low") },
                      ].map((item) => (
                        <label
                          key={item.value}
                          className={cn(
                            "flex flex-1 items-center justify-center gap-3 px-4 py-3 rounded-sm border transition-all cursor-pointer font-medium text-base",
                            field.value === item.value
                              ? "bg-white text-primary border-primary ring-1 ring-primary/20 shadow-sm"
                              : "border-gray-100 text-[#6B7280] bg-white hover:border-gray-200"
                          )}
                        >
                          <RadioGroupItem value={item.value} className="sr-only" />
                          <div
                            className={cn(
                              "size-5 rounded-full border flex items-center justify-center transition-all",
                              field.value === item.value ? "border-primary" : "border-gray-300"
                            )}
                          >
                            {field.value === item.value && (
                              <div className="size-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#1B1343]">
                    {t("checklists.taskForm.dueDate")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-[52px] justify-start gap-4 text-left border-gray-200 bg-[#F9FAFB] rounded-sm  font-medium text-base px-5",
                            !field.value && "text-[#4F4F4F]"
                          )}
                        >
                          <div className="size-8 rounded-full border border-gray-100 flex items-center justify-center shrink-0 text-[#4F4F4F]">
                            <CalendarIcon className="size-4.5 text-[#4F4F4F]" />
                          </div>
                          {field.value ? format(field.value, "dd-MM-yyyy") : "01-02-2026"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          {/* Assigned + Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Assigned */}
            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#1B1343]">
                    {t("checklists.taskForm.assignedTo")}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {[
                        { label: t("checklists.taskForm.assignees.none"), value: "none" },
                        { label: t("checklists.taskForm.assignees.me"), value: "me", initial: "M", color: "bg-[#EDE9FE] text-[#A855F7]" },
                        { label: t("checklists.taskForm.assignees.partner"), value: "partner", initial: "P", color: "bg-[#E0F2F1] text-[#2DD4BF]" },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          onClick={() => field.onChange(item.value)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-3 px-3 py-3 rounded-sm border transition-all font-medium text-base h-[52px]",
                            field.value === item.value
                              ? "border-primary text-primary ring-1 ring-primary/20 bg-white shadow-sm"
                              : "border-gray-100 text-[#6B7280] bg-white hover:border-gray-200"
                          )}
                        >
                          {item.initial && (
                            <div className={cn("size-6 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0", item.color)}>
                              {item.initial}
                            </div>
                          )}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Reminder */}
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#1B1343]">
                    {t("checklists.taskForm.reminder")}
                  </FormLabel>
                  <FormControl>
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        "w-full h-[46px] justify-center gap-3 text-base items-center rounded-full font-outfit transition-all duration-300",
                        !field.value && "border-[#A855F7] text-[#A855F7]",
                        field.value && "bg-[#A855F7] hover:bg-[#9333EA] text-white"
                      )}
                    >
                      <div className={cn(
                        "size-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        field.value ? "bg-white/20" : "bg-purple-50"
                      )}>
                        <Bell className={cn("size-4", field.value ? "text-white" : "text-[#A855F7]")} />
                      </div>
                      {field.value ? t("checklists.taskForm.reminderSet") : t("checklists.taskForm.setReminder")}
                    </Button>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#1B1343]">
                    {t("checklists.taskForm.notes")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("checklists.taskForm.notesPlaceholder")}
                    className="min-h-30 bg-purple-50"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <p className="text-sm text-gray-500">
            {t("checklists.taskForm.notesHelper")}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 text-lg">
            {/* Delete */}
            {isUpdate && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeletingItem}
                className="flex items-center gap-2 text-[#E7000B] font-semibold hover:opacity-80 transition-opacity"
              >
                {t("checklists.taskForm.deleteTask")}
                <span className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </span>
              </button>
            )}

            {/* Submit */}
            <Button
              disabled={isCreatingItem || isUpdatingItem}
              type="submit"
              className={cn(
                "bg-[#A97AEC] hover:bg-[#A97AEC] text-white px-8 h-[54px] rounded-full text-lg font-semibold flex items-center gap-3 shadow-md",
                !isUpdate && "ml-auto"
              )}
            >
              {isUpdate ? t("checklists.taskForm.updateTask") : t("checklists.taskForm.createTask")}
              <div className="size-8 rounded-full bg-white flex items-center justify-center shrink-0">
                {(isCreatingItem || isUpdatingItem) ? (
                  <Loader2 className="size-5 text-[#A855F7] animate-spin" />
                ) : (
                  <Save className="size-5 text-[#A855F7]" />
                )}
              </div>
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-[20px] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-[24px] font-bold text-[#1B1343]">
              {t("checklists.taskForm.deleteConfirm.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[18px] text-[#6B7280]">
              {t("checklists.taskForm.deleteConfirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-center gap-4 sm:justify-center pt-4">
            <AlertDialogCancel
              disabled={isDeletingItem}
              className="h-[50px] px-8 rounded-xl border-[#E5E7EB] text-[#6B7280] font-semibold text-lg hover:bg-gray-50"
            >
              {t("checklists.taskForm.deleteConfirm.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingItem}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="h-[50px] min-w-[140px] px-8 rounded-xl bg-[#E7000B] hover:bg-[#C40009] text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-sm"
            >
              {isDeletingItem ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="size-5" />
                  {t("checklists.taskForm.deleteConfirm.delete")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
