"use client";

import React from "react";
import ChangePasswordForm from "./_component/ChangPasswordForm";
import Image from "next/image";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function page() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title={t("changePassword.title")}
        description={t("changePassword.description")}
        image="/images/auth/change-password.png"
      >
        <ChangePasswordForm />
      </AuthCard>
    </div>
  );
}
