"use client";

import Image from "next/image";
import { Calendar, CalendarDays, Clock, MapPin, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { InvitationTemplate } from "../_types/invitation_types";
import { TEMPLATE_STYLES } from "../_lib/templates";

interface Props {
  title?: string;
  subtitle?: string | null;
  message?: string | null;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  replyBy?: string | null;
  template?: InvitationTemplate;
  coverImage?: string | null;
}

export default function InvitationPreview({
  title,
  subtitle,
  message,
  date,
  time,
  location,
  replyBy,
  template = "scandinavian_minimal",
  coverImage,
}: Props) {
  const { t } = useTranslation();
  const style =
    TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.scandinavian_minimal;
  const fmtDate = date
    ? new Date(date).toLocaleDateString("sv-SE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative overflow-hidden h-[433px] lg:h-[755px] rounded-[8px] border bg-white shadow-week-details">
      {/* <div
        className={cn(
          "flex h-44 items-center justify-center bg-gradient-to-br",
          style.gradient
        )}
      > */}
      {coverImage ? (
        <Image src={coverImage} alt="" fill className="object-cover" />
      ) : (
        <div className="p-2">
          <div className="bg-primary-light2 border border-dashed border-primary rounded-[6px] w-full h-[190px] lg:h-[300px] flex items-center justify-center flex-col">
            <Image
              src={"/images/icons/inv-01.png"}
              width={700}
              height={700}
              alt=""
              className="w-14 h-14 object-cover"
            />
            <p className="text-[14px]! md:text-base! font-semibold! font-outfit!">
              Template preview
            </p>
            <p className="text-[10px]! md:text-sm! md:font-normal! font-outfit! text-center!">
              Choose a template in the next step to see your invitation design
            </p>
          </div>
        </div>
      )}
      {/* </div> */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-center">
        <h3 className="font-outfit! text-sm! md:text-[22px]! font-semibold! text-primary-dark">
          {title || t("invitations.preview.eventTitle")}
        </h3>

        <p className="font-outfit! text-[11px]! md:text-base! text-primary">
          {subtitle || t("invitations.preview.eventSubtitle")}
        </p>

        <p className="font-outfit! mx-auto max-w-sm text-sm md:text-base! text-text-secondary mt-2 mb-[9px]">
          {message || t("invitations.preview.defaultMessage")}
        </p>

        <div className="grid grid-cols-3 border-y border-y-[#ECE8F5] gap-3 py-2 text-primary-dark">
          <span className="font-outfit! flex items-center justify-center gap-1 text-[11px]! md:text-base! border-r border-r-[#ECE8F5]! font-semibold!">
            <CalendarDays className="size-3.5 text-primary shrink-0" />{" "}
            {fmtDate || t("invitations.preview.defaultdate")}
          </span>

          <span className="font-outfit! flex items-center justify-center gap-1 text-[11px]! md:text-base! font-semibold! border-r border-r-[#ECE8F5]!">
            <Clock className="size-3.5 text-primary shrink-0" />{" "}
            {time || t("invitations.preview.defaulttime")}
          </span>

          <span className="font-outfit! flex items-center justify-center gap-1 text-[11px]! md:text-base! font-semibold!">
            <MapPinned className="size-3.5 text-primary shrink-0" />{" "}
            {location || t("invitations.preview.defaultlocation")}
          </span>
        </div>

        <p className="font-outfit! flex items-center justify-center gap-1 pt-1 text-[11px]! md:text-base! font-semibold! text-primary-dark! mt-2">
          <CalendarDays className="size-3.5 text-primary shrink-0" />
          {t("invitations.preview.latestReply", {
            date: replyBy ? new Date(replyBy).toLocaleDateString("sv-SE") : "",
          })}
        </p>
      </div>
    </div>
  );
}
