"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/Dialog";
import { CheckCircle2, Gift, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import InvitationPreview from "../../_component/InvitationPreview";
import { useQueryPublicInvitation } from "../../_api/queries/useQueryInvitations";
import { useRespondInvitation } from "../../_api/mutations/useInvitationMutations";

export default function PublicInvitationClient() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useQueryPublicInvitation(token);
  const respond = useRespondInvitation();
  const [acceptedOpen, setAcceptedOpen] = useState(false);

  const guestToken = data?.guest?.token ?? token;
  const alreadyResponded =
    data?.guest?.rsvp_status === "accepted" ||
    data?.guest?.rsvp_status === "declined";

  const handleRespond = (status: "accepted" | "declined") => {
    respond.mutate(
      { token: guestToken, status },
      {
        onSuccess: () => {
          if (status === "accepted") setAcceptedOpen(true);
          else toast.success("Response recorded");
        },
      }
    );
  };

  const handleSeeWishlist = async () => {
    try {
      const res = await api.get(`/public/event-invitations/${token}/wishlist`);
      const shareToken = res.data?.data?.share_token;
      if (shareToken) router.push(`/onskelistor/delad/${shareToken}`);
      else toast.error("No wishlist attached");
    } catch {
      toast.error("Could not open wishlist");
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Mail className="size-4" /> Invitations
          </span>
          <h1 className="mt-2 text-3xl font-bold text-primary-dark">
            You are Invited
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            You have been invited to a special celebration.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : isError || !data ? (
          <Card className="p-10 text-center text-text-secondary">
            This invitation could not be found or is no longer available.
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

            {alreadyResponded ? (
              <Card className="mt-6 p-5 text-center text-sm text-primary-dark">
                You have already{" "}
                <span className="font-semibold">
                  {data.guest?.rsvp_status}
                </span>{" "}
                this invitation.
              </Card>
            ) : (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleRespond("declined")}
                  disabled={respond.isPending}
                >
                  Deny Invitation
                </Button>
                <Button
                  onClick={() => handleRespond("accepted")}
                  disabled={respond.isPending}
                >
                  {respond.isPending && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Accept Invitation
                </Button>
                {data.invitation.has_wishlist && (
                  <Button variant="purple" onClick={handleSeeWishlist}>
                    <Gift className="size-4" /> See Wishlist
                  </Button>
                )}
              </div>
            )}
            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-text-secondary">
              <ShieldCheck className="size-3.5" /> Your response is private and
              secure.
            </p>
          </>
        )}
      </div>

      <Dialog open={acceptedOpen} onOpenChange={setAcceptedOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary-light">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-primary-dark">
            Invitation Accepted!
          </h2>
          <p className="mx-auto max-w-xs text-sm text-text-secondary">
            Thank you for your response. We look forward to celebrating with you!
          </p>
          {data?.invitation.has_wishlist && (
            <Button
              className="mt-4 w-full justify-center"
              onClick={handleSeeWishlist}
            >
              <Gift className="size-4" /> View Wishlist
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
