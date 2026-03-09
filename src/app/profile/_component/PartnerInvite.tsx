"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import IconDelete from "@/components/svg-icon/icon-delete";
import { useQueryGetInvitations } from "../_api/queries/useQueryGetInvitations";
import { useInvitationCreate } from "../_api/mutations/useInvitationCreate";
import { useInvitationDelete } from "../_api/mutations/useInvitationDelete";
import { toast } from "sonner";

export default function PartnerInvite() {
  const { t } = useTranslation();
  const { data: invitationsData, isLoading: isFetching } =
    useQueryGetInvitations();
  const { mutate: createInvitation, isPending: isCreating } =
    useInvitationCreate();
  const { mutate: deleteInvitation, isPending: isDeleting } =
    useInvitationDelete();

  const [email, setEmail] = useState("");
  const [roleLabel, setRoleLabel] = useState(t("partner.rolePartner"));
  const [roleValue, setRoleValue] = useState("partner");

  const partners = invitationsData?.data?.data || [];

  const handleSendInvite = () => {
    if (!email) {
      toast.error(t("common.error"), {
        description: t("signUp.userEmail") + " is required",
      });
      return;
    }
    createInvitation(
      {
        email,
        invitation_type: roleValue,
      },
      {
        onSuccess: () => {
          toast.success(
            t("partner.feedbackSuccess") || "Invitation sent successfully"
          );
          setEmail("");
        },
        onError: (error: any) => {
          toast.error(t("common.error"), {
            description:
              error?.response?.data?.message || "Failed to send invitation",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteInvitation(id, {
      onSuccess: () => {
        toast.success(
          t("profile.deleteSuccess") || "Invitation deleted successfully"
        );
      },
      onError: (error: any) => {
        toast.error(t("common.error"), {
          description:
            error?.response?.data?.message || "Failed to delete invitation",
        });
      },
    });
  };

  const handleRoleSelect = (label: string, value: string) => {
    setRoleLabel(label);
    setRoleValue(value);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-[#F3EAFF] overflow-hidden">
      {/* Upper Section: Invite Form */}
      <div className="p-6 bg-[#FBF8FF] border-b border-[#F3EAFF]">
        <h3 className="text-[#4D2C82] text-xl font-semibold mb-3 flex items-center gap-2">
          {t("partner.inviteTitle")}
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center max-w-2xl relative ">
          <div className="flex flex-1 items-stretch h-11  border-[#A97AEC] rounded-lg border bg-white overflow-hidden">
            <input
              type="email"
              placeholder={t("partner.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isCreating}
              className="flex-1 px-4 py-2 text-[#A179F2] placeholder:text-[#A179F2]/60 outline-none text-sm md:text-base border-r border-[#A97AEC] disabled:opacity-50"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isCreating}>
                <button className="flex items-center justify-between gap-4 px-4 bg-white text-[#A179F2] hover:bg-[#FBF8FF] transition-colors min-w-28 text-sm md:text-base border-r border-[#A179F2] disabled:opacity-50">
                  {roleLabel}
                  <ChevronDown className="size-4 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    handleRoleSelect(t("partner.rolePartner"), "partner")
                  }
                  className="text-[#A179F2]"
                >
                  {t("partner.rolePartner")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleRoleSelect(t("partner.roleOther"), "other")
                  }
                  className="text-[#A179F2]"
                >
                  {t("partner.roleOther")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white px-6 font-medium transition-colors text-sm md:text-base whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
              onClick={handleSendInvite}
              disabled={isCreating}
            >
              {isCreating && <Loader2 className="size-4 animate-spin" />}
              {t("partner.sendInvite")}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Section: Email List */}
      <div className="p-6 bg-white min-h-60">
        <h4 className="text-[#4D2C82] text-xl font-semibold mb-2 text-left">
          {t("partner.emailAddress")}
        </h4>

        {isFetching ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-10 text-secondary-foreground opacity-60">
            {t("common.notFound") || "No invitations found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-soft-white">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="flex items-center justify-between p-3 bg-[#FBF8FF] rounded-lg border border-[#F3EAFF]  hover:shadow-md transition-shadow"
              >
                <span className="text-[#5B5B5B] text-sm md:text-base font-semibold truncate mr-2">
                  {partner.email}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    className={cn(
                      "px-4 py-1 text-sm  font-semibold min-w-23 text-center border-none",
                      partner.status !== "accepted"
                        ? "bg-[#FFBB55] text-white"
                        : "bg-[#4ADE80] text-white"
                    )}
                  >
                    {partner.status !== "accepted"
                      ? t("partner.statusInvited")
                      : t("partner.statusAccepted")}
                  </Badge>
                  <button
                    onClick={() => handleDelete(partner._id)}
                    disabled={isDeleting}
                    className="text-[#4D2C82] hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                  >
                    <IconDelete className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
