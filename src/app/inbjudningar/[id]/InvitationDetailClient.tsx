"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Gift,
  MapPin,
  Plus,
  Send,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import InvitationPreview from "../_component/InvitationPreview";
import { useQueryInvitationDetail } from "../_api/queries/useQueryInvitations";
import {
  useAddRecipients,
  useRemoveRecipient,
  useSendInvitation,
} from "../_api/mutations/useInvitationMutations";
import { RsvpStatus } from "../_types/invitation_types";

const STATUS_STYLE: Record<RsvpStatus, string> = {
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-600",
  viewed: "bg-blue-100 text-blue-600",
  pending: "bg-gray-100 text-gray-500",
};

export default function InvitationDetailClient() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: inv, isLoading } = useQueryInvitationDetail(id);
  const addRecipients = useAddRecipients();
  const removeRecipient = useRemoveRecipient();
  const send = useSendInvitation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const statusLabel = (s: RsvpStatus) => t(`invitations.status.${s}`);

  const handleShare = () => {
    if (!inv) return;
    const url = `${window.location.origin}/inbjudningar/rsvp/${inv.share_token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success(t("invitations.detail.linkCopied")),
      () => toast.error(t("invitations.detail.copyFailed"))
    );
  };

  const handleAddGuest = () => {
    if (!name.trim() || !email.trim())
      return toast.error(t("invitations.detail.enterNameEmail"));
    addRecipients.mutate(
      { id, recipients: [{ name: name.trim(), email: email.trim() }] },
      {
        onSuccess: () => {
          toast.success(t("invitations.detail.guestAdded"));
          setName("");
          setEmail("");
        },
      }
    );
  };

  const handleSend = () => {
    send.mutate(
      { id },
      { onSuccess: () => toast.success(t("invitations.detail.invitationSent")) }
    );
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/inbjudningar"
          className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> {t("invitations.detail.back")}
        </Link>

        {isLoading || !inv ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <InvitationPreview
                title={inv.title}
                subtitle={inv.subtitle}
                message={inv.message}
                date={inv.event_date}
                time={inv.event_time}
                location={inv.location}
                replyBy={inv.reply_by}
                template={inv.template}
                coverImage={inv.cover_image}
              />

              <Card className="p-6">
                <h3 className="mb-3 font-semibold text-primary-dark">
                  {t("invitations.detail.eventDetails")}
                </h3>
                <div className="space-y-2 text-sm text-text-secondary">
                  {inv.event_date && (
                    <p className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      {new Date(inv.event_date).toLocaleDateString("sv-SE")}
                      {inv.event_time && (
                        <>
                          <Clock className="ml-2 size-4 text-primary" />
                          {inv.event_time}
                        </>
                      )}
                    </p>
                  )}
                  {inv.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" /> {inv.location}
                    </p>
                  )}
                  {inv.wishlist && (
                    <p className="flex items-center gap-2 text-primary">
                      <Gift className="size-4" />{" "}
                      {t("invitations.detail.wishlistAttached")}
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-primary-dark">
                    {t("invitations.detail.guestList", {
                      count: inv.guests.length,
                    })}
                  </h3>
                </div>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("invitations.detail.guestName")}
                  />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("invitations.detail.email")}
                  />
                  <Button
                    onClick={handleAddGuest}
                    disabled={addRecipients.isPending}
                  >
                    <Plus className="size-4" /> {t("invitations.detail.add")}
                  </Button>
                </div>
                <div className="space-y-2">
                  {inv.guests.length === 0 && (
                    <p className="py-4 text-center text-sm text-text-secondary">
                      {t("invitations.detail.noGuests")}
                    </p>
                  )}
                  {inv.guests.map((g) => (
                    <div
                      key={g._id}
                      className="flex items-center justify-between rounded-lg bg-primary-light/30 px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-primary-dark">
                          {g.name}
                        </p>
                        <p className="text-xs text-text-secondary">{g.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            STATUS_STYLE[g.rsvp_status]
                          )}
                        >
                          {statusLabel(g.rsvp_status)}
                        </span>
                        <button
                          onClick={() =>
                            removeRecipient.mutate(
                              { id, guestId: g._id },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    t("invitations.detail.guestRemoved")
                                  ),
                              }
                            )
                          }
                          className="text-text-secondary hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-3 font-semibold text-primary-dark">
                  {t("invitations.detail.actions")}
                </h3>
                <div className="space-y-2">
                  {inv.status !== "sent" && (
                    <Button
                      onClick={handleSend}
                      disabled={send.isPending}
                      className="w-full justify-center"
                    >
                      <Send className="size-4" />{" "}
                      {t("invitations.detail.sendInvitation")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="w-full justify-center"
                  >
                    <Share2 className="size-4" />{" "}
                    {t("invitations.detail.shareLink")}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 font-semibold text-primary-dark">
                  {t("invitations.detail.statistics")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox
                    label={t("invitations.detail.totalSent")}
                    value={inv.statistics.total_sent}
                  />
                  <StatBox
                    label={t("invitations.detail.viewed")}
                    value={inv.statistics.viewed}
                  />
                  <StatBox
                    label={t("invitations.detail.accepted")}
                    value={inv.statistics.accepted}
                  />
                  <StatBox
                    label={t("invitations.detail.pending")}
                    value={inv.statistics.pending}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-primary-light/30 p-3 text-center">
      <p className="text-2xl font-bold text-primary-dark">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
