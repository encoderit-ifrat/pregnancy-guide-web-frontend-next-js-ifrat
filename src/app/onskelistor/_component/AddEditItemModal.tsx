"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CircleX, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useAddWishlistItem,
  useUpdateWishlistItem,
} from "../_api/mutations/useWishlistMutations";
import { WishlistItem } from "../_types/wishlist_types";

export default function AddEditItemModal({
  wishlistId,
  item,
  open,
  onOpenChange,
}: {
  wishlistId: string;
  item?: WishlistItem | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const isEdit = !!item;
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [description, setDescription] = useState("");

  const add = useAddWishlistItem();
  const update = useUpdateWishlistItem();
  const pending = add.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setQuantity(item?.quantity ?? 1);
      setPrice(item?.price != null ? String(item.price) : "");
      setProductUrl(item?.product_url ?? "");
      setDescription(item?.description ?? "");
    }
  }, [open, item]);

  const handleSubmit = () => {
    if (!title.trim()) return toast.error(t("wishlists.item.titleRequired"));
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum <= 0)
      return toast.error(t("wishlists.item.priceInvalid"));

    const body = {
      title: title.trim(),
      quantity,
      price: priceNum,
      currency: "SEK",
      product_url: productUrl.trim() || undefined,
      description: description.trim() || undefined,
    };

    const onSuccess = () => {
      toast.success(
        isEdit ? t("wishlists.item.updated") : t("wishlists.item.added")
      );
      onOpenChange(false);
    };

    if (isEdit && item) {
      update.mutate({ id: wishlistId, itemId: item._id, body }, { onSuccess });
    } else {
      add.mutate({ id: wishlistId, body }, { onSuccess });
    }
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
              {isEdit
                ? t("wishlists.item.editTitle")
                : t("wishlists.item.addTitle")}
            </h3>
          </DialogTitle>
          <CircleX
            className="shrink-0 size-8 cursor-pointer text-black"
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="px-2.5 sm:px-[30px] py-5">
          <div className="space-y-4">
            <Field label={t("wishlists.item.productTitle")}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-[5px]"
                placeholder={t("wishlists.item.productTitlePlaceholder")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t("wishlists.item.quantity")}>
                <div className="flex items-center h-12 rounded-[5px] border! border-[#F3EAFF]! bg-[#FBF8FF]">
                  <button
                    type="button"
                    className="px-3 py-2 text-primary"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="flex-1 text-center text-sm">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-2 text-primary"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </Field>
              <Field label={t("wishlists.item.price")}>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-[5px]"
                  placeholder={t("wishlists.item.pricePlaceholder")}
                />
              </Field>
            </div>

            <Field label={t("wishlists.item.productUrl")}>
              <Input
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="rounded-[5px]"
                placeholder="https://…"
              />
            </Field>

            <Field label={t("wishlists.item.description")}>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-[5px] px-4! h-[74px] bg-[#FBF8FF] border! border-[#F3EAFF]!"
                placeholder={t("wishlists.item.descriptionPlaceholder")}
              />
            </Field>
          </div>

          <div className="mt-[30px] flex flex-col md:flex-row w-full gap-3">
            <Button
              variant="outline"
              className="flex-1 justify-center py-2.5 bg-primary-light2!"
              onClick={() => onOpenChange(false)}
            >
              {t("wishlists.item.cancel")}
            </Button>
            <Button
              className="flex-1 justify-center py-2.5"
              onClick={handleSubmit}
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              <span>
                {isEdit ? t("wishlists.item.save") : t("wishlists.item.add")}
              </span>
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
