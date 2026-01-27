import React from "react";
import UpdatePasswordForm from "./_component/UpdatePasswordForm";
import Image from "next/image";
import ForgotPassword from "@/app/forgot-password/_component/ForgotPasswordForm";
import AuthCard from "@/components/ui/cards/AuthCard";

export default function page() {
  return (
      <div className="max-w-5xl mx-auto">
        <AuthCard
            title="Change Password"
            description="Enter your current password and choose a new secure password for your account."
            image="/images/auth/change-password.png"
        >
          <UpdatePasswordForm/>
        </AuthCard>
      </div>
  );
}
