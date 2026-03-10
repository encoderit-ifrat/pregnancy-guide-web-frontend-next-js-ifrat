"use client";

import { Suspense, useEffect } from "react";
import LoginForm from "./_component/LoginForm";
import AuthCard from "@/components/ui/cards/AuthCard";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function LoginContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(
      "👉 ~ LoginContent ~ searchParams:",
      searchParams.get("invitation")
    );
    if (searchParams.get("invitation") === "accepted") {
      toast.success(
        "New account created successfuly. Plase chaeck your email for password"
      );
    }
  }, [searchParams]);

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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
