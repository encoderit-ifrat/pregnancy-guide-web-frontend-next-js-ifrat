"use client";

import React, { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ChevronRight, X } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutationUpdateThread } from "../_api/mutations/useThreadMutations";
import { toast } from "sonner";

interface EditThreadModalProps {
  id: string;
  initialTitle: string;
  initialDescription: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditThreadModal({
  id,
  initialTitle,
  initialDescription,
  open,
  onOpenChange,
  onSuccess,
}: EditThreadModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateThread = useMutationUpdateThread();

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [open, initialTitle, initialDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error(t("threads.fillAllFields") || "Please fill all fields");
      return;
    }

    if (title.length < 3) {
      toast.error(t("threads.titleMinLength") || "Title must be at least 3 characters");
      return;
    }

    if (description.length < 10) {
      toast.error(t("threads.descriptionMinLength") || "Description must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateThread.mutateAsync({
        id,
        body: { title, description },
      });
      toast.success(t("threads.threadUpdated") || "Thread updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || t("threads.errorUpdating") || "Error updating thread");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full lg:max-w-4xl flex flex-col p-0 rounded-[40px] border-none overflow-hidden bg-white"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {t("threads.editThreadTitle") || "Edit Thread"}
        </DialogTitle>

        <DialogPrimitive.Close className="absolute top-8 right-8 size-8 bg-white rounded-full border-3 border-[#3D3177] flex items-center justify-center text-primary-color hover:bg-[#F6F0FF] transition-colors z-15 shadow-sm">
          <X className="size-4 stroke-3" />
        </DialogPrimitive.Close>

        <form onSubmit={handleSubmit}>
          <div className="p-8 lg:p-16">
            <h2 className="text-[26px] lg:text-[45px] font-semibold font-poppins text-primary-color mb-9">
              {t("threads.editThreadTitle") || "Edit Thread"}
            </h2>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="lg:text-3xl text-xl font-poppins font-semibold text-primary-color">
                  {t("threads.inputTitleLabel") || "Title"}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("threads.inputTitlePlaceholder") || "Enter title"}
                  className="w-full border-2 border-[#DED7F1] rounded-2xl p-3 focus:ring-2 focus:ring-[#9A79F1]/20 focus:border-[#9A79F1] outline-none text-primary-color placeholder:text-[#D1C6F0] transition-colors"
                  minLength={3}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="lg:text-3xl text-xl font-poppins font-semibold text-primary-color">
                  {t("threads.inputDescriptionLabel") || "Description"}
                </label>
                <Textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("threads.inputDescriptionPlaceholder") || "Enter description"}
                  className="w-full border-2 border-[#DED7F1] rounded-2xl p-3 focus:ring-2 focus:ring-[#9A79F1]/20 focus:border-[#9A79F1] outline-none text-primary-color placeholder:text-[#D1C6F0] transition-colors resize-none"
                  minLength={10}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-12">
              <Button
                type="submit"
                className="font-semibold font-poppins h-12 rounded-full px-10 lg:text-lg gap-2"
                variant="default"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("common.loading") || "Loading..."
                  : t("common.save") || "Save Changes"}
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
