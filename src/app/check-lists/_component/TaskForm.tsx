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
import { CalendarIcon, Bell, Trash2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { useState } from "react";

// ----------------------
// ZOD SCHEMA
// ----------------------
const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  priority: z.enum(["high", "medium", "low"]),
  assignedTo: z.enum(["none", "me", "partner"]),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ----------------------
// COMPONENT
// ----------------------
export default function TaskForm() {
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      priority: "high",
      assignedTo: "partner",
      notes: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Buy baby clothes"
                    className="border-purple-300 focus-visible:ring-purple-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-6">
            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-3"
                    >
                      {["high", "medium", "low"].map((item) => (
                        <label
                          key={item}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer capitalize",
                            field.value === item
                              ? "border-purple-400 bg-purple-50 text-purple-600"
                              : "bg-gray-100"
                          )}
                        >
                          <RadioGroupItem value={item} />
                          {item}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-purple-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd-MM-yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      form.setValue("dueDate", d);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          </div>

          {/* Assigned + Reminder */}
          <div className="grid grid-cols-2 gap-6">
            {/* Assigned */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      {[
                        { label: "None", value: "none" },
                        { label: "Me", value: "me" },
                        { label: "Partner", value: "partner" },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          onClick={() => field.onChange(item.value)}
                          className={cn(
                            "px-4 py-2 rounded-lg border",
                            field.value === item.value
                              ? "border-purple-400 text-purple-600"
                              : "bg-gray-100"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Reminder */}
            <div>
              <FormLabel>Reminder</FormLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center border-purple-300 text-purple-500"
              >
                <Bell className="mr-2 h-4 w-4" />
                Set Reminder
              </Button>
            </div>
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes..."
                    className="min-h-30 bg-purple-50"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <p className="text-sm text-gray-500">
            These notes are only visible when the task is expanded
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4">
            {/* Delete */}
            <button
              type="button"
              className="flex items-center gap-2 text-red-500 font-medium"
            >
              Delete Task
              <span className="bg-red-100 p-2 rounded-full">
                <Trash2 className="w-4 h-4" />
              </span>
            </button>

            {/* Submit */}
            <Button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 rounded-full"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
