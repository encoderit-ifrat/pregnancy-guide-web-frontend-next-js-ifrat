"use client";

import React from "react";
import UpdatePasswordForm from "./_component/UpdatePasswordForm";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/providers/I18nProvider";

export default function ChangePasswordPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title={t("changePassword.title")}
        description={t("changePassword.description")}
        image="/images/auth/change-password.png"
      >
        <UpdatePasswordForm />
      </AuthCard>
    </div>
  );
}
