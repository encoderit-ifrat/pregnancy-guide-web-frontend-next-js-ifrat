import React from "react";
import ForgotPassword from "./_component/ForgotPasswordForm";
import Image from "next/image";
import AuthCard from "@/components/ui/cards/AuthCard";
import LoginForm from "@/app/login/_component/LoginForm";

export default function page() {
  return (
      <div className="max-w-5xl mx-auto">
        <AuthCard
            image="/images/auth/forget-password.png"
        >
          <ForgotPassword/>
        </AuthCard>
      </div>
  );
}
