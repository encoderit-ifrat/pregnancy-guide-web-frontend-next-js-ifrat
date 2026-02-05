import React from "react";
import ChangePasswordForm from "./_component/ChangPasswordForm";
import Image from "next/image";
import AuthCard from "@/components/ui/cards/AuthCard";
import UpdatePasswordForm from "@/app/change-password/_component/UpdatePasswordForm";

export default function page() {
  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title="Change Password"
        description="Enter your current password and choose a new secure password for your account."
        image="/images/auth/change-password.png"
      >
        <ChangePasswordForm />
      </AuthCard>
    </div>
  );
}
