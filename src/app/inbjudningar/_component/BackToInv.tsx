"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackToInv() {
  const { t } = useTranslation();
  return (
    <Link
      href={"/inbjudningar"}
      className="flex items-center gap-2 mt-[35px] lg:mt-[60px]"
    >
      <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
      <p className="text-base font-normal">
        {t("invitations.backToInvitations")}
      </p>
    </Link>
  );
}
