"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import {
  Check,
  CheckCircle2,
  Download,
  FileText,
  Gift,
  Info,
  Link2,
  Loader2,
  Mail,
  Plus,
  SkipForward,
  Upload,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import InvitationPreview from "../_component/InvitationPreview";
import {
  DeliveryOption,
  InvitationTemplate,
  Recipient,
} from "../_types/invitation_types";
import {
  useCreateInvitation,
  useSendInvitation,
  useUpdateInvitation,
} from "../_api/mutations/useInvitationMutations";
import { useQueryInvitationTemplates } from "../_api/queries/useQueryInvitations";
import { useQueryWishlists } from "@/app/onskelistor/_api/queries/useQueryWishlists";
import BackToInv from "../_component/BackToInv";
import Image from "next/image";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { useFileUploadTempFolder } from "@/app/min-profil/_api/mutations/useFileUploadTempFolder";
import { formatDate } from "date-fns";

export default function CreateInvitationClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: templatesData } = useQueryInvitationTemplates();
  const [step, setStep] = useState(0);
  const [sentOpen, setSentOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const STEPS = [
    {
      title: t("invitations.builder.stepEventInfo.title"),
      subtitle: t("invitations.builder.stepEventInfo.subtitle"),
    },
    {
      title: t("invitations.builder.stepTemplate.title"),
      subtitle: t("invitations.builder.stepTemplate.subtitle"),
    },
    {
      title: t("invitations.builder.stepWishlist.title"),
      subtitle: t("invitations.builder.stepWishlist.subtitle"),
    },
    {
      title: t("invitations.builder.stepRecipients.title"),
      subtitle: t("invitations.builder.stepRecipients.subtitle"),
    },
    {
      title: t("invitations.builder.stepPreview.title"),
      subtitle: t("invitations.builder.stepPreview.subtitle"),
    },
  ];

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [replyBy, setReplyBy] = useState<Date | undefined>();
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | undefined>();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [delivery, setDelivery] = useState<DeliveryOption[]>(["email"]);
  const [scheduleAt, setScheduleAt] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [sendLater, setSendLater] = useState(false);
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [coverImageName, setCoverImageName] = useState<string>("");
  const [emailError, setEmailError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInitialized = useRef(false);
  const coverPreviewUrl = coverImage;

  const { data: wishlistsData } = useQueryWishlists();
  const wishlists = wishlistsData?.data ?? [];

  const templates = templatesData ?? [];

  useEffect(() => {
    if (templates?.length && !templateInitialized.current) {
      setTemplate(templates[0]?._id);
      templateInitialized.current = true;
    }
  }, [templatesData]);

  const create = useCreateInvitation();
  const update = useUpdateInvitation();
  const send = useSendInvitation();
  const uploadTemp = useFileUploadTempFolder();
  const submitting = create.isPending || send.isPending || uploadTemp.isPending;

  // ─── Auto-save to draft ─────────────────────────────────────────────────────
  // The invitation is persisted as a DRAFT as soon as the host enters any real
  // content, then continuously PATCHed as they progress, so nothing is lost if
  // they navigate away or get interrupted mid-wizard.
  const [draftId, setDraftId] = useState<string | null>(null);
  const draftIdRef = useRef<string | null>(null);
  const creatingRef = useRef(false); // guards against a duplicate initial create
  const finalizingRef = useRef(false); // pauses autosave during final send
  const draftCreated = useRef(false); // guards initial draft creation to one-time only
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const selectedTemplate = templates.find((tpl) => tpl._id === template);

  const buildPayload = useCallback(
    (): Record<string, unknown> => ({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      message: message.trim() || undefined,
      event_date: date ? date.toISOString() : undefined,
      event_time: time || undefined,
      reply_by: replyBy ? replyBy.toISOString() : undefined,
      location: location.trim() || undefined,
      template: coverImage ? "custom" : selectedTemplate?.slug,
      cover_image: coverImage ? coverImage : selectedTemplate?.preview_url,
      wishlist: wishlistId,
      delivery_options: delivery,
      recipients,
    }),
    [
      title,
      subtitle,
      message,
      date,
      time,
      replyBy,
      location,
      coverImage,
      selectedTemplate?.slug,
      selectedTemplate?.preview_url,
      wishlistId,
      delivery,
      recipients,
    ]
  );

  // Only content the host actually entered counts — template/delivery default
  // themselves, so they must not trigger a draft on their own.
  const hasMeaningfulInput = useMemo(
    () =>
      !!title.trim() ||
      !!subtitle.trim() ||
      !!message.trim() ||
      !!date ||
      !!time ||
      !!replyBy ||
      !!location.trim() ||
      recipients.length > 0 ||
      !!wishlistId ||
      !!coverImage,
    [
      title,
      subtitle,
      message,
      date,
      time,
      replyBy,
      location,
      recipients.length,
      wishlistId,
      coverImage,
    ]
  );

  const persistDraft = useCallback(async () => {
    if (finalizingRef.current || creatingRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = buildPayload() as any;
    try {
      setSaveState("saving");
      if (!draftIdRef.current) {
        creatingRef.current = true;
        const created = await create.mutateAsync(payload);
        draftIdRef.current = created._id;
        setDraftId(created._id);
        creatingRef.current = false;
      } else {
        await update.mutateAsync({ id: draftIdRef.current, body: payload });
      }
      setSaveState("saved");
    } catch {
      creatingRef.current = false;
      setSaveState("idle");
    }
  }, [buildPayload, create, update]);

  // Create the initial draft once when the host enters meaningful input.
  // Subsequent saves only happen on next/prev clicks or final send.
  useEffect(() => {
    if (!hasMeaningfulInput || finalizingRef.current || draftCreated.current)
      return;
    const handle = setTimeout(() => {
      draftCreated.current = true;
      void persistDraft();
    }, 1000);
    return () => clearTimeout(handle);
  }, [buildPayload, hasMeaningfulInput, persistDraft]);

  const next = () => {
    if (step === 0 && !title.trim()) {
      toast.error(t("invitations.builder.titleRequired"));
      return;
    }
    if (step === 0 && !date) {
      toast.error(t("invitations.builder.dateRequired"));
      return;
    }
    if (step === 0 && !time) {
      toast.error(t("invitations.builder.timeRequired"));
      return;
    }
    if (step === 0 && !replyBy) {
      toast.error(t("invitations.builder.replyByRequired"));
      return;
    }
    if (step === 0 && !location.trim()) {
      toast.error(t("invitations.builder.locationRequired"));
      return;
    }
    if (step === 3 && recipients.length === 0) {
      toast.error(t("invitations.builder.recipientRequired"));
      return;
    }
    void persistDraft();
    window.scrollTo(0, 0);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => {
    void persistDraft();
    window.scrollTo(0, 0);
    setStep((s) => Math.max(0, s - 1));
  };

  const addRecipient = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error(t("invitations.builder.enterNameEmail"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
      setEmailError(true);
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

  const scheduleAtIso = () =>
    sendLater && scheduleAt
      ? (() => {
          const d = new Date(scheduleAt);
          if (scheduleTime) {
            const [hours, minutes] = scheduleTime.split(":");
            d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          }
          return d.toISOString();
        })()
      : undefined;

  const handleSubmit = async () => {
    if (!date) {
      toast.error(t("invitations.builder.dateRequired"));
      setStep(0);
      return;
    }
    if (!template && !coverImage) return;

    // Stop autosave from racing the final create/send, then reuse the draft
    // already created during the wizard instead of making a duplicate.
    finalizingRef.current = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = buildPayload() as any;

    try {
      let id = draftIdRef.current;
      if (id) {
        await update.mutateAsync({ id, body: payload });
      } else {
        const created = await create.mutateAsync(payload);
        id = created._id;
        draftIdRef.current = created._id;
        setDraftId(created._id);
      }
      if (id) {
        await send.mutateAsync({
          id,
          schedule_at: scheduleAtIso(),
          delivery_options: delivery,
        });
      }
      setSentOpen(true);
    } catch {
      // The draft is already persisted; sending just failed validation, so
      // keep it as a draft the host can finish later.
      finalizingRef.current = false;
      toast.success(t("invitations.builder.savedDraft"));
      router.push("/inbjudningar");
    }
  };
  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl ">
        <BackToInv />

        <Card className="px-[9px] py-[25px] lg:px-[35px] xl:px-[66px] lg:py-10 mt-[35px] md:mt-[60px] font-outfit">
          <h1 className="font-outfit! text-2xl md:text-[30px]! font-bold text-primary-dark">
            {t("invitations.builder.title")}
          </h1>
          <p className="font-outfit! text-sm md:text-base text-text-secondary">
            {t("invitations.builder.subtitle")}
          </p>

          {(saveState !== "idle" || draftId) && (
            <div className="font-outfit! mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
              {saveState === "saving" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("invitations.builder.autosaving")}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>{t("invitations.builder.autosaved")}</span>
                </>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            {STEPS.map((stepItem, i) => (
              <div
                key={stepItem.title}
                className="relative flex flex-1 min-w-0 flex-col items-center h-[75px] md:h-[100px] justify-between"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-outfit! text-[9px]! md:text-[13px]! font-medium text-center text-[#44506A]">
                    {stepItem.subtitle}
                  </span>
                  <span className="font-outfit! max-w-[70px] md:max-w-[90px] line-clamp-2 text-balance text-[10px] md:text-[17px]! leading-tight font-medium text-center text-text-dark break-words">
                    {stepItem.title}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-outfit! relative z-20 flex size-[18px] md:size-6 items-center justify-center rounded-full text-[10px] md:text-sm! font-medium md:font-semibold",
                    i <= step
                      ? "bg-primary text-white"
                      : "bg-primary-light text-primary"
                  )}
                >
                  {i < step ? (
                    <Check className="size-4" />
                  ) : i > step ? (
                    ""
                  ) : (
                    i + 1
                  )}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "absolute bottom-[8px] md:bottom-[9px] left-[calc(50%+9px)] z-10 h-0.5",
                      i < step ? "bg-primary" : "bg-primary-light"
                    )}
                    style={{ width: "calc(100% - 18px)" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {step === 0 && (
                <>
                  <h2 className="font-outfit! font-semibold! text-[25px]! text-primary-dark mb-0.5!">
                    {t("invitations.builder.eventInformation")}
                  </h2>
                  <p className="font-outfit! text-primary-dark">
                    {t("invitations.builder.InvitationDeatilsBelow")}
                  </p>
                  <Field label={t("invitations.builder.eventTitle")}>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="rounded-[5px]"
                      placeholder={t(
                        "invitations.builder.eventTitlePlaceholder"
                      )}
                    />
                  </Field>
                  <Field label={t("invitations.builder.subtitleLabel")}>
                    <Input
                      value={subtitle}
                      className="rounded-[5px]"
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder={t("invitations.builder.subtitlePlaceholder")}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t("invitations.builder.date")}>
                      <DatePicker
                        value={date}
                        onChange={setDate}
                        placeholder={`${formatDate(new Date(), "dd/MM/yyyy")}`}
                        inputClassName="rounded-[5px] bg-[#FBF8FF]! border! border-[#F3EAFF]!"
                        fromDate={new Date()}
                      />
                    </Field>
                    <Field label={t("invitations.builder.time")}>
                      <div className="flex items-center gap-1 rounded-[5px] bg-[#FBF8FF] px-2">
                        <Select
                          value={time ? time.split(":")[0] : undefined}
                          onValueChange={(hour) => {
                            const minute = time ? time.split(":")[1] : "00";
                            setTime(`${hour}:${minute}`);
                          }}
                        >
                          <SelectTrigger className="w-[72px] border-0 focus:border-0 focus-visible:border-0 focus:bg-[#FBF8FF] data-[state=open]:bg-[#FBF8FF] focus-visible:bg-[#FBF8FF] justify-center text-center px-1">
                            <SelectValue placeholder="HH" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) =>
                              String(i).padStart(2, "0")
                            ).map((h) => (
                              <SelectItem key={h} value={h}>
                                {h}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-lg font-medium text-gray-400">
                          :
                        </span>
                        <Select
                          value={time ? time.split(":")[1] : undefined}
                          onValueChange={(minute) => {
                            const hour = time ? time.split(":")[0] : "00";
                            setTime(`${hour}:${minute}`);
                          }}
                        >
                          <SelectTrigger className="w-[72px] border-0 focus:border-0 focus-visible:border-0 focus:bg-[#FBF8FF] data-[state=open]:bg-[#FBF8FF] focus-visible:bg-[#FBF8FF] justify-center text-center px-1">
                            <SelectValue placeholder="mm" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) =>
                              String(i).padStart(2, "0")
                            ).map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </Field>
                  </div>
                  <Field label={t("invitations.builder.latestReply")}>
                    <DatePicker
                      value={replyBy}
                      onChange={setReplyBy}
                      placeholder={`${formatDate(new Date(), "dd/MM/yyyy")}`}
                      inputClassName="rounded-[5px] bg-[#FBF8FF]! border! border-[#F3EAFF]!"
                      fromDate={new Date()}
                    />
                  </Field>
                  <Field label={t("invitations.builder.location")}>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="rounded-[5px]"
                      placeholder={t("invitations.builder.locationPlaceholder")}
                    />
                  </Field>
                  <Field label={t("invitations.builder.customMessage")}>
                    <Textarea
                      value={message}
                      className="rounded-[5px] border! border-[#F3EAFF]! bg-[#FBF8FF]! h-[100px]"
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
                  <h2 className="font-outfit! font-semibold text-primary-dark mb-0.5!">
                    {t("invitations.builder.chooseTemplate")}
                  </h2>
                  <p className="font-outfit! text-primary-dark!">
                    {t("invitations.builder.chooseTemplateBelow")}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      disabled={uploadTemp.isPending}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 border-2 border-dashed border-primary bg-[#FAF9FF] rounded-[5px] py-2.5 px-4 flex-1 text-sm font-medium text-primary-dark hover:bg-primary-light/20 transition-colors disabled:opacity-50"
                    >
                      {uploadTemp.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      <div>
                        <p className="text-start">
                          {uploadTemp.isPending
                            ? "Uploading..."
                            : coverImageName ||
                              t("invitations.builder.uploadCoverImage")}
                        </p>
                        <p className="text-start text-[10px]! font-normal!">
                          JPG, PNG, or SVG (Max. 5MB)
                        </p>
                      </div>
                    </button>
                    {coverImage && !uploadTemp.isPending ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage(undefined);
                          setCoverImageName("");
                          setTemplate(templates[0]?._id);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="size-[38px] flex items-center justify-center rounded-full bg-primary-light text-primary hover:bg-primary/20 transition-colors shrink-0"
                      >
                        <X className="size-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="size-[38px] flex items-center justify-center rounded-full bg-primary-light text-primary cursor-default shrink-0"
                      >
                        <Info className="size-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setCoverImageName(file.name);
                        setTemplate(null);
                        uploadTemp.mutate(
                          { file },
                          {
                            onSuccess: (res) => {
                              const filePath = res?.data?.file;
                              if (filePath) {
                                setCoverImage(filePath);
                              } else {
                                toast.error("Failed to get uploaded file path");
                                setCoverImageName("");
                              }
                            },
                            onError: (err) => {
                              toast.error("Failed to upload image");
                              setCoverImageName("");
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            },
                          }
                        );
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((t, idx) => (
                      <button
                        key={idx}
                        disabled={uploadTemp.isPending}
                        onClick={() => {
                          setTemplate(t._id);
                          setCoverImage(undefined);
                          setCoverImageName("");
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className={cn(
                          "overflow-hidden relative p-1 rounded-[5px] border  text-left transition-all",
                          template === t._id
                            ? "border-primary"
                            : "border-primary-light2 hover:border-primary/40",
                          uploadTemp.isPending &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {template === t._id && (
                          <span className="absolute right-1 top-1 rounded-full bg-primary p-1">
                            <Check
                              strokeWidth={3}
                              className="size-3 text-white"
                            />
                          </span>
                        )}
                        <Image
                          src={imageLinkGenerator(t.preview_url)}
                          width={700}
                          height={700}
                          alt=""
                          className="h-[76px] w-full object-cover rounded-[5px]"
                        />
                        <span className="font-outfit! block text-center! text-[11px]! font-semibold! text-primary-dark mt-1.5! mb-0.5!">
                          {t.name}
                        </span>
                        <span className="font-outfit! block text-[10px]! text-center! font-medium! text-primary-dark">
                          {""}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-outfit! text-[25px]! font-semibold! text-primary-dark mb-0.5!">
                    {t("invitations.builder.attachWishlist")}
                  </h2>
                  <p className="font-outfit! text-base! font-normal! text-text-secondary">
                    {t("invitations.builder.attachWishlistDesc")}
                  </p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      {wishlists.map((w) => (
                        <button
                          key={w._id}
                          onClick={() =>
                            setWishlistId(
                              wishlistId === w._id ? undefined : w._id
                            )
                          }
                          className={cn(
                            "overflow-hidden relative p-1 rounded-[5px] border  text-left transition-all",
                            wishlistId === w._id
                              ? "border-primary"
                              : "border-primary-light2 hover:border-primary/40"
                          )}
                        >
                          {wishlistId === w._id && (
                            <span className="absolute right-1 top-1 rounded-full bg-primary p-1">
                              <Check
                                strokeWidth={3}
                                className="size-3 text-white"
                              />
                            </span>
                          )}
                          <Image
                            src={
                              w.cover_image
                                ? imageLinkGenerator(w.cover_image)
                                : "/images/preview-01.png"
                            }
                            width={700}
                            height={700}
                            alt=""
                            className="h-[76px] w-full object-cover rounded-[5px]"
                          />
                          <p className="font-outfit! text-center! text-[11px]! font-semibold! text-primary-dark mt-1.5! mb-0.5! line-clamp-1">
                            {w.title}
                          </p>
                          <p className="font-outfit! text-[10px]! text-center! font-medium! text-primary-dark line-clamp-2">
                            {w.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setLeaveOpen(true)}
                      className="flex w-full items-center justify-center md:justify-start gap-3 rounded-[10px] border p-3 text-left border-primary bg-primary-light/30"
                    >
                      <Plus className="size-8 text-white p-1.5 rounded-full bg-primary" />
                      <div className="flex flex-col">
                        <span className="font-outfit! text-base! font-semibold! text-primary-dark">
                          {t("invitations.builder.createWishlist")}
                        </span>
                        <span className="font-outfit! text-xs! font-normal! text-primary-dark">
                          {t("invitations.builder.createWishlistDesc")}
                        </span>
                      </div>
                    </button>

                    <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("invitations.builder.confirmLeaveTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("invitations.builder.confirmLeaveDesc")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="justify-center">
                            {t("invitations.builder.confirmLeaveCancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => router.push("/onskelistor")}
                          >
                            {t("invitations.builder.confirmLeaveAction")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-outfit! font-semibold text-2xl! md:text-[25px]! text-primary-dark mb-0.5!">
                    {t("invitations.builder.addRecipients")}
                  </h2>
                  <p className="font-outfit! text-base! text-primary-dark!">
                    {t("invitations.builder.chooseTemplateBelow")}
                  </p>
                  <Field label={t("invitations.builder.guestName")}>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="rounded-[5px]"
                      placeholder={t(
                        "invitations.builder.guestNamePlaceholder"
                      )}
                    />
                  </Field>
                  <Field label={t("invitations.builder.email")}>
                    <div className="flex gap-2">
                      <Input
                        value={guestEmail}
                        onChange={(e) => {
                          setGuestEmail(e.target.value);
                          setEmailError(false);
                        }}
                        className={cn(
                          "rounded-[5px]",
                          emailError && "border-destructive!"
                        )}
                        placeholder={t("invitations.builder.emailPlaceholder")}
                        onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                      />
                      <Button onClick={addRecipient} type="button">
                        {t("invitations.builder.add")}
                      </Button>
                    </div>
                    {emailError && (
                      <p className="text-destructive! text-xs! mt-1!">
                        Invalid email format
                      </p>
                    )}
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    {recipients.map((r, i) => (
                      <span
                        key={`${r.email}-${i}`}
                        className="font-outfit! inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-sm text-primary-dark"
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
                  <h2 className="font-outfit! font-semibold text-primary-dark mb-0.5!">
                    {t("invitations.builder.stepPreview.title")}
                  </h2>
                  <p className="font-outfit! text-primary-dark!">
                    {t("invitations.builder.stepPreviewDes")}
                  </p>
                  <div className="space-y-2">
                    <p className="font-outfit! font-semibold! text-primary-dark!">
                      {t("invitations.builder.eventDetails")}
                    </p>
                    <SummaryRow
                      label={t("invitations.builder.totalGuests")}
                      value={String(recipients.length)}
                      icon={<Users className="size-3.5 text-primary" />}
                    />
                    <SummaryRow
                      label={t("invitations.builder.emailStatus")}
                      value={t("invitations.builder.readyToSend")}
                      icon={
                        <Mail size={16} className="size-3.5 text-primary" />
                      }
                    />
                    <SummaryRow
                      label={t("invitations.builder.wishlistAttached")}
                      value={
                        wishlistId
                          ? t("invitations.builder.yes")
                          : t("invitations.builder.no")
                      }
                      icon={<Gift className="size-3.5 text-primary" />}
                    />
                    <SummaryRow
                      label={t("invitations.builder.selectedTemplate")}
                      value={
                        templates.find((t) => t._id === template)?.name ??
                        template
                      }
                      icon={<FileText className="size-3.5 text-primary" />}
                    />
                  </div>

                  <Field label={t("invitations.builder.deliveryOptions")}>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["email", t("invitations.builder.emailInvitation")],
                          ["share_link", t("invitations.builder.shareLink")],
                          [
                            "download_card",
                            t("invitations.builder.downloadCard"),
                          ],
                        ] as [DeliveryOption, string][]
                      ).map(([opt, label]) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleDelivery(opt)}
                          className={cn(
                            "font-outfit! flex flex-col items-center gap-2 rounded-[5px] border px-3 py-2.5 text-sm",
                            delivery.includes(opt)
                              ? "border-primary bg-primary-light text-primary"
                              : "text-text-secondary"
                          )}
                        >
                          <div className=" p-1.5 rounded-full bg-[#FAF5FF]">
                            {opt === "email" ? (
                              <Mail className="size-3.5 text-primary" />
                            ) : opt === "share_link" ? (
                              <Link2 className="size-3.5 text-primary" />
                            ) : (
                              <Download className="size-3.5 text-primary" />
                            )}
                          </div>
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label={""}>
                    <p className="font-outfit! font-semibold! text-primary-dark! mb-2">
                      {t("invitations.builder.scheduleSend")}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <Label
                        htmlFor="send-later"
                        className="text-sm text-primary-dark cursor-pointer"
                      >
                        {sendLater
                          ? t("invitations.builder.sendLater")
                          : t("invitations.builder.sendNow")}
                      </Label>{" "}
                      <Switch
                        id="send-later"
                        checked={sendLater}
                        onCheckedChange={setSendLater}
                      />
                    </div>
                    {sendLater && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Field label={t("invitations.builder.date")}>
                          <DatePicker
                            value={scheduleAt}
                            onChange={setScheduleAt}
                            placeholder={`${formatDate(new Date(), "dd/MM/yyyy")}`}
                            inputClassName="rounded-[5px] bg-[#FBF8FF]! border! border-[#F3EAFF]!"
                            fromDate={new Date()}
                          />
                        </Field>

                        <Field label={t("invitations.builder.time")}>
                          <div className="flex items-center rounded-[5px] bg-[#FBF8FF] px-2 gap-1">
                            <Select
                              value={
                                scheduleTime
                                  ? scheduleTime.split(":")[0]
                                  : undefined
                              }
                              onValueChange={(hour) => {
                                const minute = scheduleTime
                                  ? scheduleTime.split(":")[1]
                                  : "00";
                                setScheduleTime(`${hour}:${minute}`);
                              }}
                            >
                              <SelectTrigger className="h-11 md:h-12 w-[72px]  border-0 focus:border-0 focus-visible:border-0 focus:bg-[#FBF8FF] data-[state=open]:bg-[#FBF8FF] focus-visible:bg-[#FBF8FF] justify-center text-center px-1">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) =>
                                  String(i).padStart(2, "0")
                                ).map((h) => (
                                  <SelectItem key={h} value={h}>
                                    {h}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-lg font-medium text-gray-400">
                              :
                            </span>
                            <Select
                              value={
                                scheduleTime
                                  ? scheduleTime.split(":")[1]
                                  : undefined
                              }
                              onValueChange={(minute) => {
                                const hour = scheduleTime
                                  ? scheduleTime.split(":")[0]
                                  : "00";
                                setScheduleTime(`${hour}:${minute}`);
                              }}
                            >
                              <SelectTrigger className="h-11 md:h-12 w-[72px]  border-0 focus:border-0 focus-visible:border-0 focus:bg-[#FBF8FF] data-[state=open]:bg-[#FBF8FF] focus-visible:bg-[#FBF8FF] justify-center text-center px-1">
                                <SelectValue placeholder="mm" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 60 }, (_, i) =>
                                  String(i).padStart(2, "0")
                                ).map((m) => (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </Field>
                      </div>
                    )}
                  </Field>
                </>
              )}
            </div>

            <div className="lg:top-24 lg:self-start">
              <p className="font-outfit! mb-2 text-[25px]! font-semibold text-primary-dark">
                {t("invitations.builder.livePreview")}
              </p>
              <p className="font-outfit! mb-2 text-base! font-medium text-primary-dark">
                {t("invitations.builder.livePreviewsub")}
              </p>
              <InvitationPreview
                title={title}
                subtitle={subtitle}
                message={message}
                date={date?.toISOString() || null}
                time={time}
                location={location}
                replyBy={replyBy?.toISOString()}
                template={template}
                coverImage={coverPreviewUrl}
                templatePreviewUrl={
                  step !== 0 && template
                    ? templates.find((t) => t._id === template)?.preview_url
                    : undefined
                }
              />
            </div>
            <div
              className={cn(
                "flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between",
                step !== 0 && "lg:col-span-2"
              )}
            >
              <Button
                variant="outline"
                onClick={back}
                disabled={step === 0}
                className="flex-1 w-full md:max-w-[243px] py-2.5 justify-center"
              >
                {t("invitations.builder.cancel")}
              </Button>
              {step === 2 ? (
                <div className="flex w-full flex-1 gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo(0, 0);
                    }}
                    className="flex-1 sm:flex-none w-full md:max-w-[243px] py-2.5 justify-center"
                  >
                    <SkipForward />
                    Skip
                  </Button>
                  <Button
                    onClick={next}
                    disabled={uploadTemp.isPending}
                    className="flex-1 sm:flex-none w-full md:max-w-[243px] py-2.5"
                  >
                    {t("invitations.builder.continue")}
                  </Button>
                </div>
              ) : step < STEPS.length - 1 ? (
                <Button
                  onClick={next}
                  disabled={uploadTemp.isPending}
                  className="flex-1 w-full md:max-w-[243px] py-2.5"
                >
                  {t("invitations.builder.continue")}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 w-full md:max-w-[243px] py-2.5"
                >
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
        </Card>
      </div>

      <Dialog open={sentOpen} onOpenChange={setSentOpen}>
        <DialogContent className="max-w-[350px] md:max-w-md bg-white rounded-[8px]!">
          <div className="mx-auto mb-2 flex items-center justify-center rounded-full ">
            <Image
              src="/images/icons/gift_claimed.png"
              alt="check"
              width={500}
              height={500}
              className="size-[68px] object-cover mb-2"
            />
          </div>
          <h2 className="font-outfit! text-[25px]! font-bold text-primary-dark! text-center!">
            {sendLater
              ? t("invitations.builder.scheduledTitle")
              : t("invitations.builder.sentTitle")}
          </h2>
          <p className="font-outfit! mx-auto max-w-xs text-base! font-normal! text-primary-dark! text-center!">
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
      <label className="font-outfit! mb-1.5 block text-sm font-medium text-primary-dark">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between bg-[#FAFAFD] rounded-[5px] px-[15px] py-2.5">
      <div className="flex items-center gap-[10px]">
        {icon}
        <span className="font-outfit! text-text-secondary">{label}</span>
      </div>
      <span className="font-outfit! font-medium text-primary-dark">
        {value || t("invitations.builder.custom")}
      </span>
    </div>
  );
}
