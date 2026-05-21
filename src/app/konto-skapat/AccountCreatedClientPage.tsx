"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  useVerifyEmail,
  verifyEmailRequestType,
} from "../auth/verify-email/_api/mutations/useVerifyEmail";
import AuthCard from "@/components/ui/cards/AuthCard";
import LoginForm from "../logga-in/_component/LoginForm";
import Link from "next/link";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
};

export default function AccountCreatedClientPage() {
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [message, setMessage] = useState("");

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus(STATUS.ERROR);
      setMessage("Ingen verifieringstoken hittades i URL:en");
      return;
    }
    const verifyData: verifyEmailRequestType = {
      token: token,
    };
    verifyEmailMutation.mutate(verifyData, {
      onSuccess: () => {
        setStatus(STATUS.SUCCESS);
        setMessage("E-postadressen har verifierats!");
      },
      onError() {
        setStatus(STATUS.ERROR);
        setMessage(
          "Ett fel inträffade vid verifieringen. Försök igen senare."
        );
      },
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {status === STATUS.VERIFYING && (
        <AuthCard
          title="Verifierar din e-post..."
          description=""
          image="/images/auth/sign-up.png"
        >
          <div className="flex justify-center py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        </AuthCard>
      )}

      {status === STATUS.SUCCESS && (
        <AuthCard
          title="Din e-postadress är verifierad!"
          description=""
          image="/images/auth/sign-up.png"
        >
          <div className="space-y-4 text-text-dark">
            <p>
              Ditt konto är nu klart. Logga in med din e-postadress och ditt
              lösenord så är du igång.
            </p>
            <p>Välkommen till Familj.se.</p>
          </div>
          <div className="mt-6">
            <LoginForm />
          </div>
        </AuthCard>
      )}

      {status === STATUS.ERROR && (
        <AuthCard
          title="Verifieringen misslyckades"
          description=""
          image="/images/auth/sign-up.png"
        >
          <p className="text-red-600 mb-4">{message}</p>
          <Link
            href="/resend-verify-email"
            className="text-circle-border hover:underline"
          >
            Skicka verifieringsmejl igen
          </Link>
        </AuthCard>
      )}
    </div>
  );
}
