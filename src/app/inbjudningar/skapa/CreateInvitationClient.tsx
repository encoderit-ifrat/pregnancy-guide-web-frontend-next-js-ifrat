"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DatePicker } from "@/components/ui/DatePicker";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Gift,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import InvitationPreview from "../_component/InvitationPreview";
import { TEMPLATE_STYLES } from "../_lib/templates";
import {
  DeliveryOption,
  InvitationTemplate,
  Recipient,
} from "../_types/invitation_types";
import {
  useCreateInvitation,
  useSendInvitation,
} from "../_api/mutations/useInvitationMutations";
import { useQueryWishlists } from "@/app/onskelistor/_api/queries/useQueryWishlists";

const TEMPLATE_IDS: InvitationTemplate[] = [
  "scandinavian_minimal",
  "baby_pink",
  "neutral_beige",
  "elegant_lavender",
];

export default function CreateInvitationClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sentOpen, setSentOpen] = useState(false);

  const STEPS = [
    t("invitations.builder.stepEventInfo"),
    t("invitations.builder.stepTemplate"),
    t("invitations.builder.stepWishlist"),
    t("invitations.builder.stepRecipients"),
    t("invitations.builder.stepPreview"),
  ];

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [replyBy, setReplyBy] = useState<Date | undefined>();
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<InvitationTemplate>(
    "scandinavian_minimal"
  );
  const [wishlistId, setWishlistId] = useState<string | undefined>();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [delivery, setDelivery] = useState<DeliveryOption[]>(["email"]);
  const [scheduleAt, setScheduleAt] = useState<Date | undefined>();
  const [sendLater, setSendLater] = useState(false);

  const { data: wishlistsData } = useQueryWishlists();
  const wishlists = wishlistsData?.data ?? [];

  const create = useCreateInvitation();
  const send = useSendInvitation();
  const submitting = create.isPending || send.isPending;

  const next = () => {
    if (step === 0 && !title.trim()) {
      toast.error(t("invitations.builder.titleRequired"));
      return;
    }
    if (step === 3 && recipients.length === 0) {
      toast.error(t("invitations.builder.recipientRequired"));
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const addRecipient = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error(t("invitations.builder.enterNameEmail"));
      return;
    }
    setRecipients((r) => [
      ...r,
      { name: guestName.trim(), email: guestEmail.trim() },
    ]);
    setGuestName("");
    setGuestEmail("");
  };

  const toggleDelivery = (opt: DeliveryOption) =>
    setDelivery((d) =>
      d.includes(opt) ? d.filter((x) => x !== opt) : [...d, opt]
    );

  const handleSubmit = () => {
    if (!date) {
      toast.error(t("invitations.builder.dateRequired"));
      setStep(0);
      return;
    }
    create.mutate(
      {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        message: message.trim() || undefined,
        event_date: date.toISOString(),
        event_time: time || undefined,
        reply_by: replyBy ? replyBy.toISOString() : undefined,
        location: location.trim() || undefined,
        template,
        wishlist: wishlistId,
        delivery_options: delivery,
        recipients,
      },
      {
        onSuccess: (created: { _id: string }) => {
          send.mutate(
            {
              id: created._id,
              schedule_at:
                sendLater && scheduleAt ? scheduleAt.toISOString() : undefined,
              delivery_options: delivery,
            },
            {
              onSuccess: () => setSentOpen(true),
              onError: () => {
                toast.success(t("invitations.builder.savedDraft"));
                router.push("/inbjudningar");
              },
            }
          );
        },
      }
    );
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/inbjudningar"
          className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> {t("invitations.builder.back")}
        </Link>

        <Card className="p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-primary-dark">
            {t("invitations.builder.title")}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("invitations.builder.subtitle")}
          </p>

          <div className="mt-6 flex items-center justify-between gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                      i <= step
                        ? "bg-primary text-white"
                        : "bg-primary-light text-primary"
                    )}
                  >
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className="hidden text-xs text-text-secondary sm:block">
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      i < step ? "bg-primary" : "bg-primary-light"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {step === 0 && (
                <>
                  <h2 className="font-semibold text-primary-dark">
                    {t("invitations.builder.eventInformation")}
                  </h2>
                  <Field label={t("invitations.builder.eventTitle")}>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("invitations.builder.eventTitlePlaceholder")}
                    />
                  </Field>
                  <Field label={t("invitations.builder.subtitleLabel")}>
                    <Input
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder={t("invitations.builder.subtitlePlaceholder")}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t("invitations.builder.date")}>
                      <DatePicker value={date} onChange={setDate} />
                    </Field>
                    <Field label={t("invitations.builder.time")}>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label={t("invitations.builder.latestReply")}>
                    <DatePicker value={replyBy} onChange={setReplyBy} />
                  </Field>
                  <Field label={t("invitations.builder.location")}>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t("invitations.builder.locationPlaceholder")}
                    />
                  </Field>
                  <Field label={t("invitations.builder.customMessage")}>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t(
                        "invitations.builder.customMessagePlaceholder"
                      )}
                    />
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-semibold text-primary-dark">
                    {t("invitations.builder.chooseTemplate")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {TEMPLATE_IDS.map((id) => (
                      <button
                        key={id}
                        onClick={() => setTemplate(id)}
                        className={cn(
                          "overflow-hidden rounded-xl border-2 text-left transition-all",
                          template === id
                            ? "border-primary"
                            : "border-transparent hover:border-primary/40"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-24 items-center justify-center bg-gradient-to-br text-3xl",
                            TEMPLATE_STYLES[id].gradient
                          )}
                        >
                          🎈
                        </span>
                        <span className="block p-2 text-xs font-medium text-primary-dark">
                          {TEMPLATE_STYLES[id].name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-semibold text-primary-dark">
                    {t("invitations.builder.attachWishlist")}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {t("invitations.builder.attachWishlistDesc")}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setWishlistId(undefined)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left",
                        !wishlistId ? "border-primary bg-primary-light/30" : ""
                      )}
                    >
                      <X className="size-5 text-primary" />
                      <span className="text-sm font-medium text-primary-dark">
                        {t("invitations.builder.noWishlist")}
                      </span>
                    </button>
                    {wishlists.map((w) => (
                      <button
                        key={w._id}
                        onClick={() => setWishlistId(w._id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border p-3 text-left",
                          wishlistId === w._id
                            ? "border-primary bg-primary-light/30"
                            : ""
                        )}
                      >
                        <Gift className="size-5 text-primary" />
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-primary-dark">
                            {w.title}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {t("invitations.builder.itemsCount", {
                              count: w.progress.total,
                            })}
                          </span>
                        </span>
                        {wishlistId === w._id && (
                          <Check className="size-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-semibold text-primary-dark">
                    {t("invitations.builder.addRecipients")}
                  </h2>
                  <Field label={t("invitations.builder.guestName")}>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={t("invitations.builder.guestNamePlaceholder")}
                    />
                  </Field>
                  <Field label={t("invitations.builder.email")}>
                    <div className="flex gap-2">
                      <Input
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder={t("invitations.builder.emailPlaceholder")}
                        onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                      />
                      <Button onClick={addRecipient} type="button">
                        {t("invitations.builder.add")}
                      </Button>
                    </div>
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    {recipients.map((r, i) => (
                      <span
                        key={`${r.email}-${i}`}
                        className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-sm text-primary-dark"
                      >
                        {r.email}
                        <button
                          onClick={() =>
                            setRecipients((rs) => rs.filter((_, j) => j !== i))
                          }
                        >
                          <X className="size-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="font-semibold text-primary-dark">
                    {t("invitations.builder.stepPreview")}
                  </h2>
                  <div className="space-y-2 rounded-xl bg-primary-light/30 p-4 text-sm">
                    <SummaryRow
                      label={t("invitations.builder.totalGuests")}
                      value={String(recipients.length)}
                    />
                    <SummaryRow
                      label={t("invitations.builder.wishlistAttached")}
                      value={
                        wishlistId
                          ? t("invitations.builder.yes")
                          : t("invitations.builder.no")
                      }
                    />
                    <SummaryRow
                      label={t("invitations.builder.selectedTemplate")}
                      value={TEMPLATE_STYLES[template].name}
                    />
                  </div>

                  <Field label={t("invitations.builder.deliveryOptions")}>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["email", t("invitations.builder.emailInvitation")],
                          ["share_link", t("invitations.builder.shareLink")],
                          ["download_card", t("invitations.builder.downloadCard")],
                        ] as [DeliveryOption, string][]
                      ).map(([opt, label]) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleDelivery(opt)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm",
                            delivery.includes(opt)
                              ? "border-primary bg-primary-light text-primary"
                              : "text-text-secondary"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label={t("invitations.builder.scheduleSend")}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSendLater(false)}
                        className={cn(
                          "flex-1 rounded-lg border px-3 py-2 text-sm",
                          !sendLater
                            ? "border-primary bg-primary-light text-primary"
                            : "text-text-secondary"
                        )}
                      >
                        {t("invitations.builder.sendNow")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSendLater(true)}
                        className={cn(
                          "flex-1 rounded-lg border px-3 py-2 text-sm",
                          sendLater
                            ? "border-primary bg-primary-light text-primary"
                            : "text-text-secondary"
                        )}
                      >
                        {t("invitations.builder.sendLater")}
                      </button>
                    </div>
                    {sendLater && (
                      <div className="mt-2">
                        <DatePicker
                          value={scheduleAt}
                          onChange={setScheduleAt}
                        />
                      </div>
                    )}
                  </Field>
                </>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={back} disabled={step === 0}>
                  {t("invitations.builder.backBtn")}
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button onClick={next}>
                    {t("invitations.builder.continue")}
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    <span>
                      {sendLater
                        ? t("invitations.builder.schedule")
                        : t("invitations.builder.sendInvitation")}
                    </span>
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-2 text-sm font-medium text-primary-dark">
                {t("invitations.builder.livePreview")}
              </p>
              <InvitationPreview
                title={title}
                subtitle={subtitle}
                message={message}
                date={date?.toISOString()}
                time={time}
                location={location}
                replyBy={replyBy?.toISOString()}
                template={template}
              />
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={sentOpen} onOpenChange={setSentOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary-light">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-primary-dark">
            {sendLater
              ? t("invitations.builder.scheduledTitle")
              : t("invitations.builder.sentTitle")}
          </h2>
          <p className="mx-auto max-w-xs text-sm text-text-secondary">
            {t("invitations.builder.sentDesc")}
          </p>
          <Button
            className="mt-4 w-full justify-center"
            onClick={() => router.push("/inbjudningar")}
          >
            {t("invitations.builder.goToInvitations")}
          </Button>
        </DialogContent>
      </Dialog>
    </PageContainer>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-primary-dark">{value}</span>
    </div>
  );
}
