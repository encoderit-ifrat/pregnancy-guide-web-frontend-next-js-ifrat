"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Gift, Mail, MapPin, Plus, Users } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryInvitations } from "./_api/queries/useQueryInvitations";
import { EventInvitationListItem } from "./_types/invitation_types";

const TABS = [
  { key: "all", labelKey: "invitations.all" },
  { key: "draft", labelKey: "invitations.draft" },
  { key: "sent", labelKey: "invitations.sent" },
  { key: "scheduled", labelKey: "invitations.scheduled" },
];

export default function InvitationsClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [tab, setTab] = useState("all");
  const { data, isLoading } = useQueryInvitations(tab);

  const invitations = data?.data ?? [];

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Mail className="size-4" /> {t("invitations.badge")}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-primary-dark">
            {t("invitations.title")}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            {t("invitations.subtitle")}
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-full bg-primary-light/50 p-1">
              {TABS.map((tabItem) => (
                <button
                  key={tabItem.key}
                  onClick={() => setTab(tabItem.key)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    tab === tabItem.key
                      ? "bg-primary text-white"
                      : "text-primary-dark hover:text-primary"
                  )}
                >
                  {t(tabItem.labelKey)}
                </button>
              ))}
            </div>
            {isAuthenticated && (
              <Button asChild>
                <Link href="/inbjudningar/skapa">
                  {t("invitations.createInvitation")} <Plus className="size-4" />
                </Link>
              </Button>
            )}
          </div>

          {userLoading || isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : !isAuthenticated ? (
            <EmptyState
              title={t("invitations.loginTitle")}
              desc={t("invitations.loginDesc")}
              action={
                <Button asChild className="mt-4">
                  <Link href="/logga-in">{t("invitations.login")}</Link>
                </Button>
              }
            />
          ) : invitations.length === 0 ? (
            <EmptyState
              title={t("invitations.noInvitationsTitle")}
              desc={t("invitations.noInvitationsDesc")}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {invitations.map((inv) => (
                <InvitationCard key={inv._id} invitation={inv} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

function InvitationCard({ invitation }: { invitation: EventInvitationListItem }) {
  const { t } = useTranslation();
  const badge =
    invitation.status === "draft"
      ? "bg-gray-100 text-gray-600"
      : invitation.status === "scheduled"
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";
  const statusLabel =
    invitation.status === "draft"
      ? t("invitations.statusDraft")
      : invitation.status === "scheduled"
        ? t("invitations.statusScheduled")
        : t("invitations.statusSent");

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-primary-dark">{invitation.title}</h3>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            badge
          )}
        >
          {statusLabel}
        </span>
      </div>
      {invitation.subtitle && (
        <p className="mb-3 text-sm text-text-secondary">{invitation.subtitle}</p>
      )}
      <div className="space-y-1.5 text-sm text-text-secondary">
        {invitation.event_date && (
          <p className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {new Date(invitation.event_date).toLocaleDateString("sv-SE")}
            {invitation.event_time && (
              <>
                <Clock className="ml-1 size-4 text-primary" />
                {invitation.event_time}
              </>
            )}
          </p>
        )}
        {invitation.location && (
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" /> {invitation.location}
          </p>
        )}
        <p className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          {t("invitations.rsvps", {
            accepted: invitation.statistics.accepted,
            total: invitation.statistics.total_sent,
            rate: invitation.rsvp_rate,
          })}
        </p>
        {invitation.wishlist_attached && (
          <p className="flex items-center gap-2 text-primary">
            <Gift className="size-4" /> {t("invitations.wishlistAttached")}
          </p>
        )}
      </div>
      <Button asChild variant="outline" className="mt-4 w-full justify-center">
        <Link href={`/inbjudningar/${invitation._id}`}>
          {t("invitations.viewDetails")}
        </Link>
      </Button>
    </Card>
  );
}

function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary-light">
        <Mail className="size-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-primary-dark">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{desc}</p>
      {action}
    </div>
  );
}
