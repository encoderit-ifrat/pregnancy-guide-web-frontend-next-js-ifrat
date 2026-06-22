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
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
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
    if (!title.trim()) return toast.error("Please enter a product title");
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0)
      return toast.error("Please enter a valid price");

    const body = {
      title: title.trim(),
      quantity,
      price: priceNum,
      currency: "SEK",
      product_url: productUrl.trim() || undefined,
      description: description.trim() || undefined,
    };

    const onSuccess = () => {
      toast.success(isEdit ? "Item updated" : "Item added");
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Wishlist Item" : "Add Item to Wishlist"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Product Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Organic Cotton Baby Blanket"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity (PCS) *">
              <div className="flex items-center rounded-md border">
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
            <Field label="Price (SEK) *">
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 599.00"
              />
            </Field>
          </div>

          <Field label="Product URL">
            <Input
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product…"
            />
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
            disabled={pending}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Item"}
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
