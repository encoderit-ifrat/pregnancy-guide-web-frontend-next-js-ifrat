"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  CheckCircle2,
  CircleCheck,
  CircleX,
  Gift,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { useTranslation } from "@/hooks/useTranslation";
import InvitationPreview from "../../_component/InvitationPreview";
import { useQueryPublicInvitation } from "../../_api/queries/useQueryInvitations";
import {
  useMatchGuest,
  useRespondInvitation,
} from "../../_api/mutations/useInvitationMutations";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import type { RsvpStatus } from "../../_types/invitation_types";

export default function PublicInvitationClient() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useQueryPublicInvitation(token);
  const respond = useRespondInvitation();
  const matchGuest = useMatchGuest();
  const [acceptedOpen, setAcceptedOpen] = useState(false);
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  // A guest resolved by matching the visitor's email against the guest list —
  // used when they arrived via a generic share link (no per-guest token).
  const [matchedGuest, setMatchedGuest] = useState<{
    name: string;
    rsvp_status: RsvpStatus;
    token: string;
  } | null>(null);
  // The Accept/Decline choice the visitor clicked before being asked for
  // their email; recorded automatically once the email matches.
  const [pendingStatus, setPendingStatus] = useState<
    "accepted" | "declined" | null
  >(null);

  // Personally invited guests (their email link carries a per-guest token)
  // can respond directly. Share-link visitors have no guest attached — when
  // they click Accept/Decline, an email popup matches them against the guest
  // list before their response is recorded.
  const guest = data?.guest ?? matchedGuest;
  const guestToken = guest?.token;
  const replyExpired = data?.invitation?.reply_by
    ? (() => {
        const replyDate = new Date(data.invitation.reply_by);
        if (data.invitation.event_time) {
          const [hours, minutes] = data.invitation.event_time.split(":").map(Number);
          replyDate.setUTCHours(hours, minutes, 0, 0);
        }
        return replyDate.getTime() < Date.now();
      })()
    : false;
  const alreadyResponded =
    guest?.rsvp_status === "accepted" || guest?.rsvp_status === "declined";

  const recordResponse = (
    token: string,
    status: "accepted" | "declined",
    fromEmailGate: boolean
  ) => {
    respond.mutate(
      { token, status },
      {
        onSuccess: (res) => {
          setMatchedGuest((prev) =>
            prev ? { ...prev, rsvp_status: status } : prev
          );
          setEmailGateOpen(false);
          setEmail("");
          setPendingStatus(null);
          const wishlistToken = res.data?.data?.wishlist_token;
          if (fromEmailGate && status === "accepted" && wishlistToken) {
            // Requirement: after a successful gated accept, go straight to
            // the shared wishlist.
            router.push(`/onskelistor/delad/${wishlistToken}`);
            return;
          }
          if (status === "accepted") setAcceptedOpen(true);
          else toast.success(t("invitations.public.responseRecorded"));
        },
        onError: () => {
          if (fromEmailGate) setEmailError(t("invitations.public.matchError"));
        },
      }
    );
  };

  const handleRespond = (status: "accepted" | "declined") => {
    if (!guestToken) {
      // Untracked share-link visitor: ask for their email first, then record
      // the choice they just clicked.
      setPendingStatus(status);
      setEmailError(null);
      setEmailGateOpen(true);
      return;
    }
    recordResponse(guestToken, status, false);
  };

  const handleMatchGuest = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError(t("invitations.public.emailRequired"));
      return;
    }
    setEmailError(null);
    matchGuest.mutate(
      { token, email: trimmed },
      {
        onSuccess: (resolved) => {
          setMatchedGuest(resolved);
          if (
            resolved.rsvp_status === "accepted" ||
            resolved.rsvp_status === "declined"
          ) {
            // Guest already responded earlier — show that instead of
            // recording a second response.
            setEmailGateOpen(false);
            setEmail("");
            setPendingStatus(null);
            return;
          }
          if (pendingStatus) {
            recordResponse(resolved.token, pendingStatus, true);
          } else {
            setEmailGateOpen(false);
            setEmail("");
          }
        },
        onError: (err) => {
          const status = (err as AxiosError)?.response?.status;
          setEmailError(
            status === 404
              ? t("invitations.public.notOnGuestList")
              : t("invitations.public.matchError")
          );
        },
      }
    );
  };

  const handleSeeWishlist = async () => {
    try {
      const res = await api.get(`/public/event-invitations/${token}/wishlist`);
      const shareToken = res.data?.data?.share_token;
      if (shareToken) router.push(`/onskelistor/delad/${shareToken}`);
      else toast.error(t("invitations.public.noWishlist"));
    } catch {
      toast.error(t("invitations.public.wishlistError"));
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <div className="thread-header mb-8 flex flex-col items-center text-center">
          <IconHeading
            text={t("invitations.public.heading")}
            image="/images/icons/inv-01.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("invitations.public.title")}
          </SectionHeading>

          <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
            {t("invitations.public.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : isError || !data ? (
          <Card className="p-10 text-center text-text-secondary">
            {t("invitations.public.notFound")}
          </Card>
        ) : (
          <>
            <InvitationPreview
              title={data.invitation.title}
              subtitle={data.invitation.subtitle}
              message={data.invitation.message}
              date={data.invitation.event_date}
              time={data.invitation.event_time}
              location={data.invitation.location}
              replyBy={data.invitation.reply_by}
              template={data.invitation.template}
              coverImage={data.invitation.cover_image}
            />

            {replyExpired ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                <Card className="w-full p-5 text-center text-sm text-primary-dark">
                  {t("invitations.public.viewOnly")}
                </Card>
              </div>
            ) : alreadyResponded ? (
              <Card className="mt-6 p-5 text-center text-sm text-primary-dark">
                {t("invitations.public.alreadyResponded", {
                  status: t(`invitations.status.${guest!.rsvp_status}`),
                })}
              </Card>
            ) : (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleRespond("declined")}
                  disabled={respond.isPending}
                >
                  <CircleX />
                  {t("invitations.public.deny")}
                </Button>
                <Button
                  onClick={() => handleRespond("accepted")}
                  disabled={respond.isPending}
                >
                  <span>{t("invitations.public.accept")}</span>
                  {respond.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CircleCheck />
                  )}
                </Button>
                {data.invitation.has_wishlist && (
                  <Button onClick={handleSeeWishlist}>
                    <Gift className="size-4" />{" "}
                    {t("invitations.public.seeWishlist")}
                  </Button>
                )}
              </div>
            )}
            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-text-secondary">
              <ShieldCheck className="size-3.5" />{" "}
              {t("invitations.public.privateSecure")}
            </p>
          </>
        )}
      </div>

      <Dialog
        open={emailGateOpen}
        onOpenChange={(open) => {
          setEmailGateOpen(open);
          if (!open) {
            setEmailError(null);
            setPendingStatus(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary-light">
              <Mail className="size-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-primary-dark">
              {t("invitations.public.emailGateTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-text-secondary">
              {t("invitations.public.emailGateDesc")}
            </DialogDescription>
          </DialogHeader>
          <form
            className="mt-2 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleMatchGuest();
            }}
          >
            <Input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("invitations.public.emailPlaceholder")}
              aria-invalid={!!emailError}
            />
            {emailError && <p className="text-sm text-red-600">{emailError}</p>}
            <Button
              type="submit"
              className="w-full justify-center"
              disabled={matchGuest.isPending || respond.isPending}
            >
              {matchGuest.isPending || respond.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                t("invitations.public.emailSubmit")
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={acceptedOpen} onOpenChange={setAcceptedOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary-light">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-primary-dark">
            {t("invitations.public.acceptedTitle")}
          </h2>
          <p className="mx-auto max-w-xs text-sm text-text-secondary">
            {t("invitations.public.acceptedDesc")}
          </p>
          {data?.invitation.has_wishlist && (
            <Button
              className="mt-4 w-full justify-center"
              onClick={handleSeeWishlist}
            >
              <Gift className="size-4" /> {t("invitations.public.viewWishlist")}
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
