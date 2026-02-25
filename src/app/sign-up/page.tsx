"use client";

import React from "react";
import RegisterForm from "./_component/SignUpForm";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function SignUpPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title={t("signUp.title")}
        description={t("signUp.description")}
        image="/images/auth/sign-up.png"
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
