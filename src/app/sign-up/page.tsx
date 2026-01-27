import React from "react";
import RegisterForm from "./_component/SignUpForm";
import Image from "next/image";
import AuthCard from "@/components/ui/cards/AuthCard";
import LoginForm from "@/app/login/_component/LoginForm";

export default function page() {
  return (
      <div className="max-w-5xl mx-auto">
        <AuthCard
            title="Sign Up"
            description="Create an account to access expert guidance, resources, and support for every stage of parenthood."
            image="/images/auth/sign-up.png"
        >
          <RegisterForm/>
        </AuthCard>
      </div>
  );
}
