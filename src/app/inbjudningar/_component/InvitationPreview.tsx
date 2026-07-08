"use client";

import Image from "next/image";
import { Calendar, CalendarDays, Clock, MapPin, MapPinned } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { InvitationTemplate } from "../_types/invitation_types";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { formatDate } from "date-fns";
import { sv } from "date-fns/locale";

interface Props {
  title?: string;
  subtitle?: string | null;
  message?: string | null;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  replyBy?: string | null;
  template?: InvitationTemplate | null;
  coverImage?: string | null;
  templatePreviewUrl?: string | null;
}

export default function InvitationPreview({
  title,
  subtitle,
  message,
  date,
  time,
  location,
  replyBy,
  template = null,
  coverImage,
  templatePreviewUrl,
}: Props) {
  const { t } = useTranslation();
  const fmtDate = date ? formatDate(date, "MMMM dd, yyyy", { locale: sv }) : "";
  // console.log("templatePreviewUrl", templatePreviewUrl);
  // console.log("coverImage", coverImage);
  // console.log("template", template);

  return (
    <div className="relative overflow-hidden h-[433px] md:h-[755px] rounded-[8px] border bg-white shadow-week-details">
      {coverImage ? (
        <Image
          src={
            coverImage.startsWith("blob")
              ? coverImage
              : imageLinkGenerator(coverImage)
          }
          alt=""
          fill
          className="object-fill"
        />
      ) : templatePreviewUrl ? (
        <Image
          src={imageLinkGenerator(templatePreviewUrl)}
          fill
          alt=""
          className="object-fill"
        />
      ) : (
        <div className="p-2">
          <div className="bg-primary-light2 border border-dashed border-primary rounded-[6px] w-full h-[190px] md:h-[300px] flex items-center justify-center flex-col">
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
      <div className="absolute bottom-0 left-0 w-full p-4 text-center">
        <h3 className="font-outfit! text-sm! md:text-[22px]! font-semibold! text-primary-dark! mb-[11px]!">
          {title || t("invitations.preview.eventTitle")}
        </h3>

        <p className="font-outfit! text-[11px]! md:text-lg! font-semibold! text-primary-dark! mb-[11px]!">
          {subtitle || ""}
        </p>

        <p className="font-outfit! mx-auto max-w-sm text-sm md:text-base! font-normal! text-primary-dark! mb-[15px]! line-clamp-3">
          {message || ""}
        </p>

        <div className="grid grid-cols-[1fr_100px_1fr] border-y border-y-[#ECE8F5] gap-3 py-2 md:py-5 text-primary-dark">
          <p className="font-outfit! flex items-center justify-center gap-1 text-[11px]! md:text-base! border-r border-r-[#ECE8F5]! text-primary-dark! font-semibold!">
            <CalendarDays className="size-3.5 md:size-[25px] text-primary! shrink-0" />{" "}
            <span>{fmtDate || ""}</span>
          </p>

          <p className="font-outfit! flex items-center justify-center gap-1 text-[11px]! md:text-base! font-semibold! border-r border-r-[#ECE8F5]! text-primary-dark!">
            <Clock className="size-3.5 md:size-[25px] text-primary! shrink-0" />{" "}
            <span>{time || ""}</span>
          </p>

          <p className="font-outfit! flex items-center justify-center gap-1 text-[11px]! md:text-base! font-semibold!">
            <MapPinned className="size-3.5 md:size-[25px] text-primary shrink-0" />{" "}
            <p className="text-[11px]! md:text-base! font-semibold! text-start! line-clamp-3 text-primary-dark!">
              {location || ""}
            </p>
          </p>
        </div>

        <p className="font-outfit! flex items-center justify-center gap-1 pt-1 text-[11px]! md:text-base! leading-normal! font-semibold! text-primary-dark! mt-2.5">
          <CalendarDays className="size-3.5 text-primary shrink-0" />
          {t("invitations.preview.latestReply", {
            date: replyBy
              ? formatDate(replyBy, "MMMM dd, yyyy", { locale: sv })
              : "",
          })}
        </p>
      </div>
    </div>
  );
}
