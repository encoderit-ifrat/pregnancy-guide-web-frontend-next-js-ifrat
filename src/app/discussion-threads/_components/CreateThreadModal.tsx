"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ChevronRight, X } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutationCreateThread } from "../_api/mutations/useThreadMutations";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CreateThreadModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export default function CreateThreadModal({
  children,
  onSuccess,
}: CreateThreadModalProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createThread = useMutationCreateThread();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error(t("threads.fillAllFields"));
      return;
    }

    if (title.length < 3) {
      toast.error(t("threads.titleMinLength"));
      return;
    }

    if (description.length < 10) {
      toast.error(t("threads.descriptionMinLength"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createThread.mutateAsync({ title, description });
      toast.success(t("threads.threadCreated"));
      setTitle("");
      setDescription("");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || t("threads.errorCreating"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !session) {
      router.push("/login?callbackUrl=/discussion-threads");
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="w-full lg:max-w-4xl flex flex-col p-0 rounded-[40px] border-none overflow-hidden bg-white"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {t("threads.startThreadTitle")}
        </DialogTitle>

        {/* Custom Close Button */}
        <DialogPrimitive.Close className="absolute top-8 right-8 size-8 bg-white rounded-full border-3 border-[#3D3177] flex items-center justify-center text-primary-color hover:bg-[#F6F0FF] transition-colors z-15 shadow-sm">
          {/* <span className="text-2xl leading-none font-bold">x</span> */}
          <X className="size-4 stroke-3" />
        </DialogPrimitive.Close>

        <form onSubmit={handleSubmit}>
          <div className="p-8 lg:p-16">
            <h2 className="text-[26px] lg:text-[45px] font-semibold  font-poppins text-primary-color mb-9">
              {t("threads.startThreadTitle")}
            </h2>

            <div className="flex flex-col gap-8">
              {/* Title Input */}
              <div className="flex flex-col gap-3">
                <label className="lg:text-3xl text-xl font-poppins font-semibold text-primary-color">
                  {t("threads.inputTitleLabel")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("threads.inputTitlePlaceholder")}
                  className="w-full border-2 border-[#DED7F1] rounded-2xl p-3  focus:ring-2 focus:ring-[#9A79F1]/20 focus:border-[#9A79F1] outline-none text-primary-color placeholder:text-[#D1C6F0] transition-colors"
                  minLength={3}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-3">
                <label className="lg:text-3xl text-xl font-poppins font-semibold text-primary-color">
                  {t("threads.inputDescriptionLabel")}
                </label>
                <Textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("threads.inputDescriptionPlaceholder")}
                  className="w-full border-2 border-[#DED7F1] rounded-2xl p-3  focus:ring-2 focus:ring-[#9A79F1]/20 focus:border-[#9A79F1] outline-none text-primary-color placeholder:text-[#D1C6F0] transition-colors resize-none"
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
                  ? t("common.loading")
                  : t("threads.publishButton")}
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
