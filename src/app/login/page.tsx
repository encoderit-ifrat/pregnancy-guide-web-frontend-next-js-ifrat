"use client";

import LoginForm from "./_component/LoginForm";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title={t("login.title")}
        description={t("login.description")}
        image="/images/auth/login.png"
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
