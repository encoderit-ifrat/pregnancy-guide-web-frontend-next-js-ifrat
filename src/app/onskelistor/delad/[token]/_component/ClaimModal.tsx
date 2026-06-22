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
import { CheckCircle2, Gift, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useClaimWishlistItem } from "../../../_api/mutations/useWishlistMutations";
import { PublicWishlistItem } from "../../../_types/wishlist_types";

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
      <DialogContent className="max-w-md">
        {done ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-light">
              <CheckCircle2 className="size-8 text-primary" />
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
              {t("wishlists.claim.done")}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary-light">
                <Gift className="size-6 text-primary" />
              </div>
              <DialogTitle className="text-center">
                {t("wishlists.claim.title")}
              </DialogTitle>
            </DialogHeader>
            <p className="-mt-1 mb-2 text-center text-sm text-text-secondary">
              {t("wishlists.claim.subtitle")}
            </p>

            <div className="space-y-4">
              <Field label={t("wishlists.claim.yourName")}>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("wishlists.claim.namePlaceholder")}
                />
              </Field>
              <Field label={t("wishlists.claim.emailAddress")}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("wishlists.claim.emailPlaceholder")}
                />
              </Field>
              <Field label={t("wishlists.claim.optionalMessage")}>
                <Textarea
                  value={message}
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
            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-text-secondary">
              <ShieldCheck className="size-3.5" /> {t("wishlists.claim.safe")}
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
      <label className="mb-1.5 block text-sm font-medium text-primary-dark">
        {label}
      </label>
      {children}
    </div>
  );
}
