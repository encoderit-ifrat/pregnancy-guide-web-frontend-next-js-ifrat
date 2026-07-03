"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { CircleX, Gift, Info, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useCreateWishlist } from "../_api/mutations/useWishlistMutations";
import { useFileUploadTempFolder } from "@/app/min-profil/_api/mutations/useFileUploadTempFolder";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";

export default function CreateWishlistModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [replyBy, setReplyBy] = useState<Date | undefined>();

  const create = useCreateWishlist();
  const upload = useFileUploadTempFolder();

  const reset = () => {
    setTitle("");
    setDescription("");
    setCoverImage(undefined);
    setCoverPreview(undefined);
    setReplyBy(undefined);
  };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    upload.mutate(
      { file },
      {
        onSuccess: (res) => {
          const filePath = res?.data?.file;
          if (filePath) {
            setCoverImage(filePath);
            setCoverPreview(imageLinkGenerator(filePath));
          } else {
            toast.error("Failed to get uploaded file path");
          }
        },
        onError: () => {
          toast.error(t("wishlists.create.uploadFailed"));
        },
      }
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error(t("wishlists.create.titleRequired"));
      return;
    }
    create.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        cover_image: coverImage,
        reply_by: replyBy ? replyBy.toISOString() : undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("wishlists.create.created"));
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[350px] md:max-w-lg bg-white p-0 gap-0"
      >
        <div className="px-2.5 sm:px-[30px] py-5 border-b flex items-center justify-between border-b-[#F0EDF8]">
          <DialogTitle asChild>
            <h3 className="text-[25px]! sm:text-[30px]! text-[#3D3177] font-semibold!">
              {t("wishlists.create.title")}
            </h3>
          </DialogTitle>
          <CircleX
            className="shrink-0 size-8 cursor-pointer text-black"
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="px-2.5 sm:px-[30px] py-5">
          <div className="space-y-4">
            <Field label={t("wishlists.create.wishlistTitle")}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("wishlists.create.titlePlaceholder")}
              />
            </Field>

            <Field label={t("wishlists.create.description")}>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("wishlists.create.descriptionPlaceholder")}
                className="text-sm placeholder:text-sm px-4!"
              />
            </Field>

            <Field label={t("wishlists.create.coverImage")}>
              {coverPreview ? (
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={coverPreview}
                    alt="Cover"
                    width={500}
                    height={200}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(undefined);
                      setCoverPreview(undefined);
                    }}
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                  >
                    <CircleX className="size-5 text-black" />
                  </button>
                </div>
              ) : upload.isPending ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-light/20 py-8 text-center">
                  <Loader2 className="size-7 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">
                    Uploading...
                  </span>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-light/20 py-8 text-center">
                  <Gift className="size-7 text-primary" />
                  <span className="flex items-center gap-1 text-sm text-primary">
                    <Upload className="size-4" />{" "}
                    {t("wishlists.create.clickUpload")}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {t("wishlists.create.uploadHint")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={upload.isPending}
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                </label>
              )}
              <p className="mt-1 text-xs font-normal! text-text-secondary flex items-center gap-2.5">
                <Info className="text-primary" />
                {t("wishlists.create.imageOptional")}
              </p>
            </Field>

            <Field label={t("wishlists.create.latestReply")}>
              <DatePicker
                value={replyBy}
                onChange={setReplyBy}
                placeholder="dd-mm-yyy"
                inputClassName="rounded-[5px] bg-[#FBF8FF]! border! border-[#F3EAFF]!"
                fromDate={new Date()}
              />
            </Field>
          </div>

          <div className="mt-[30px] flex flex-col w-full gap-3">
            <Button
              variant="outline"
              className="flex-1 justify-center py-2.5 bg-primary-light2!"
              onClick={() => onOpenChange(false)}
            >
              {t("wishlists.create.cancel")}
            </Button>
            <Button
              className="flex-1 justify-center py-2.5"
              onClick={handleSubmit}
              disabled={create.isPending || upload.isPending}
            >
              {(create.isPending || upload.isPending) && <Loader2 className="size-4 animate-spin" />}
              <span>{t("wishlists.create.submit")}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-lg font-medium text-primary-dark">
        {label}
      </label>
      {children}
    </div>
  );
}
