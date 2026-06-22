"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const style = TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.scandinavian_minimal;
  const fmtDate = date
    ? new Date(date).toLocaleDateString("sv-SE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div
        className={cn(
          "relative flex h-44 items-center justify-center bg-gradient-to-br",
          style.gradient
        )}
      >
        {template === "custom" && coverImage ? (
          <Image src={coverImage} alt="" fill className="object-cover" />
        ) : (
          <span className="text-5xl">🎈</span>
        )}
      </div>
      <div className="space-y-3 p-6 text-center">
        <h3 className="text-xl font-bold text-primary-dark">
          {title || "Event Title"}
        </h3>
        {subtitle && <p className="text-sm text-primary">{subtitle}</p>}
        {message && (
          <p className="mx-auto max-w-sm text-sm text-text-secondary">
            {message}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 text-xs text-text-secondary">
          {fmtDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5 text-primary" /> {fmtDate}
            </span>
          )}
          {time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-primary" /> {time}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" /> {location}
            </span>
          )}
        </div>
        {replyBy && (
          <p className="pt-1 text-xs font-medium text-primary">
            Latest Time to Reply:{" "}
            {new Date(replyBy).toLocaleDateString("sv-SE")}
          </p>
        )}
      </div>
    </div>
  );
}
