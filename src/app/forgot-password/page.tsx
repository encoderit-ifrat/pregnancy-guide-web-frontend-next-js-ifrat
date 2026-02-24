"use client";

import React from "react";
import ForgotPassword from "./_component/ForgotPasswordForm";
import Image from "next/image";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function page() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title={t("forgotPassword.title")}
        description={t("forgotPassword.description")}
        image="/images/auth/forget-password.png"
      >
        <ForgotPassword />
      </AuthCard>
    </div>
  );
}
