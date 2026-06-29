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
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  CircleCheck,
  CircleX,
  Gift,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useClaimWishlistItem } from "../../../_api/mutations/useWishlistMutations";
import { PublicWishlistItem } from "../../../_types/wishlist_types";
import Image from "next/image";

export default function ClaimModal({
  token,
  item,
  open,
  onOpenChange,
}: {
  token: string;
  item: PublicWishlistItem | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const claim = useClaimWishlistItem();

  const close = (v: boolean) => {
    if (!v) {
      setName("");
      setEmail("");
      setMessage("");
      setDone(false);
    }
    onOpenChange(v);
  };

  const handleSubmit = () => {
    if (!item) return;
    if (!name.trim()) return toast.error(t("wishlists.claim.nameRequired"));
    if (!email.trim()) return toast.error(t("wishlists.claim.emailRequired"));

    claim.mutate(
      {
        token,
        itemId: item._id,
        body: {
          claimer_name: name.trim(),
          claimer_email: email.trim(),
          message: message.trim() || undefined,
        },
      },
      { onSuccess: () => setDone(true) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-[350px] md:max-w-[650px] bg-white rounded-[8px]!">
        <div className="absolute top-2 right-2">
          <CircleX
            className="shrink-0 size-8 cursor-pointer text-black"
            onClick={() => onOpenChange(false)}
          />
        </div>
        {done ? (
          <div className="py-4 text-center">
            <div className=" flex items-center justify-center">
              <Image
                src="/images/icons/gift_claimed.png"
                alt="check"
                width={500}
                height={500}
                className="size-[68px] object-cover mb-2"
              />
            </div>
            <h2 className="text-xl font-bold text-primary-dark">
              {t("wishlists.claim.claimedTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">
              {t("wishlists.claim.claimedDesc")}
            </p>
            <Button
              className="mt-5 w-full justify-center"
              onClick={() => close(false)}
            >
              <div className="flex items-center bg-white! text-primary! justify-center rounded-full p-1">
                <Check className="size-4" />
              </div>
              {t("wishlists.claim.done")}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex size-[68px] items-center justify-center t">
                <Gift className="size-[68px] text-primary" />
              </div>
              <DialogTitle className="text-center text-primary-dark! text-[25px] font-semibold!">
                {t("wishlists.claim.title")}
              </DialogTitle>
            </DialogHeader>
            <p className="-mt-1 mb-2 text-center text-base font-medium text-primary-dark!">
              {t("wishlists.claim.subtitle")}
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={t("wishlists.claim.yourName")}>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-[5px]!"
                    placeholder={t("wishlists.claim.namePlaceholder")}
                  />
                </Field>
                <Field label={t("wishlists.claim.emailAddress")}>
                  <Input
                    type="email"
                    value={email}
                    className="rounded-[5px]!"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("wishlists.claim.emailPlaceholder")}
                  />
                </Field>
              </div>
              <Field label={t("wishlists.claim.optionalMessage")}>
                <Textarea
                  value={message}
                  className="rounded-[5px] px-4! h-[74px] bg-[#FBF8FF] border! border-[#F3EAFF]!"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("wishlists.claim.messagePlaceholder")}
                />
              </Field>
            </div>

            <Button
              className="mt-4 w-full justify-center"
              onClick={handleSubmit}
              disabled={claim.isPending}
            >
              {claim.isPending && <Loader2 className="size-4 animate-spin" />}
              <Gift className="size-4" />
              <span>{t("wishlists.claim.claimGift")}</span>
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1 text-sm! font-normal! text-primary-dark!">
              <Lock className="size-3.5" /> {t("wishlists.claim.safe")}
            </p>
          </>
        )}
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
