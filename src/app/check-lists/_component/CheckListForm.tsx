"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  getChecklistSchema,
  ChecklistSchemaType,
} from "../_types/checklist_types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMutationCreateChecklist } from "../_api/mutations/UseMutationCreateChecklist";
import { Spinner } from "@/components/ui/Spinner";
import { useEffect, useRef } from "react";
import { useMutationUpdateChecklist } from "../_api/mutations/UseMutationUpdateChecklist";
import { ChecklistFormProps } from "../_types/checklist_item_types";
import { useTranslation } from "@/hooks/useTranslation";

type TProps = ChecklistFormProps;

export default function ChecklistForm({
  formData,
  onSubmitForDialogAndRefetch,
}: TProps) {
  const { t } = useTranslation();
  const hasAddedInitialItem = useRef(false);
  useEffect(() => {}, [formData]);
  const { type, data } = formData ?? {};
  const { user, refetch } = useCurrentUser();

  const last_period_date = user?.details?.last_period_date;
  const current_pregnancy_week = user?.details?.current_pregnancy_week;

  const shouldShowChecklist =
    (last_period_date && last_period_date.trim() !== "") ||
    (current_pregnancy_week && current_pregnancy_week > 0);

  const form = useForm<ChecklistSchemaType>({
    resolver: zodResolver(getChecklistSchema(t)),
    defaultValues:
      type == "update"
        ? data
        : {
            _id: "",
            title: "",
            description: "",
            category: "general",
            is_active: true,
          },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const checklistMutation = useMutationCreateChecklist();
  const { mutate: updateChecklist, isPending: isPendingUpdateChecklist } =
    useMutationUpdateChecklist();

  const onSubmit = (values: ChecklistSchemaType) => {
    if (type === "update") {
      updateChecklist(values, {
        onSuccess: (data: any) => {
          onSubmitForDialogAndRefetch();
          refetch();
          toast.success(
            data?.data?.message || t("checklists.form.updateSuccess")
          );
          reset();
        },
      });
    } else {
      checklistMutation.mutate(values, {
        onSuccess: (data: any) => {
          onSubmitForDialogAndRefetch();
          refetch();
          toast.success(
            data?.data?.message || t("checklists.form.saveSuccess")
          );
          reset();
        },
      });
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
                <FormControl>
                  <Input
                    label={t("checklists.form.title")}
                    placeholder={t("checklists.form.titlePlaceholder")}
                    required={true}
                    {...field}
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
                <FormControl>
                  <Textarea
                    label={t("checklists.form.description")}
                    placeholder={t("checklists.form.descriptionPlaceholder")}
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2"></div>
          <Button
            type="submit"
            disabled={checklistMutation.isPending || isPendingUpdateChecklist}
            className="w-full"
          >
            {checklistMutation.isPending || isPendingUpdateChecklist ? (
              <Spinner variant="circle" />
            ) : type === "update" ? (
              t("checklists.form.update")
            ) : (
              t("checklists.form.save")
            )}
          </Button>
        </form>
      </Form>
    );
  }
}
