"use client";

import React from "react";
import ForgotPassword from "./_component/ForgotPasswordForm";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function ForgotPasswordPage() {
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
