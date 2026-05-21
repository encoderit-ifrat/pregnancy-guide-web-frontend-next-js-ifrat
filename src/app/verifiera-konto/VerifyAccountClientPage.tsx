"use client";

import React from "react";
import AuthCard from "@/components/ui/cards/AuthCard";

export default function VerifyAccountClientPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <AuthCard
        title="Tack för din registrering!"
        description=""
        image="/images/auth/sign-up.png"
      >
        <div className="space-y-4 text-text-dark">
          <p>
            Du är nästan klar. För att ditt konto ska skapas behöver du verifiera
            din e-postadress.
          </p>
          <p>
            Kolla din inkorg och klicka på länken i mejlet vi precis skickat till
            dig.
          </p>
          <p>
            Varma hälsningar
            <br />
            Familj.se
          </p>
        </div>
      </AuthCard>
    </div>
  );
}
