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
import { Gift, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useCreateWishlist } from "../_api/mutations/useWishlistMutations";
import { useFileUploadTempFolder } from "@/app/min-profil/_api/mutations/useFileUploadTempFolder";

export default function CreateWishlistModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [replyBy, setReplyBy] = useState<Date | undefined>();

  const create = useCreateWishlist();
  const upload = useFileUploadTempFolder();

  const reset = () => {
    setTitle("");
    setDescription("");
    setCoverImage(undefined);
    setReplyBy(undefined);
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    upload.mutate(
      { file },
      {
        onSuccess: (res) => setCoverImage(res?.data?.data?.file),
        onError: () => toast.error("Image upload failed"),
      }
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a wishlist title");
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
          toast.success("Wishlist created");
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Wishlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Wishlist Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Emma's Baby Registry"
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Everything we need to welcome our little one…"
            />
          </Field>

          <Field label="Cover Image">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-light/20 py-8 text-center">
              {upload.isPending ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : coverImage ? (
                <span className="text-sm text-primary">Image uploaded ✓</span>
              ) : (
                <>
                  <Gift className="size-7 text-primary" />
                  <span className="flex items-center gap-1 text-sm text-primary">
                    <Upload className="size-4" /> Click to upload
                  </span>
                  <span className="text-xs text-text-secondary">
                    PNG, JPG up to 10MB
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
            <p className="mt-1 text-xs text-text-secondary">Image is optional</p>
          </Field>

          <Field label="Latest Time to Reply">
            <DatePicker value={replyBy} onChange={setReplyBy} />
          </Field>
        </div>

        <div className="mt-2 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 justify-center"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 justify-center"
            onClick={handleSubmit}
            disabled={create.isPending}
          >
            {create.isPending && <Loader2 className="size-4 animate-spin" />}
            Create Wishlist
          </Button>
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
      <label className="mb-1.5 block text-sm font-medium text-primary-dark">
        {label}
      </label>
      {children}
    </div>
  );
}
