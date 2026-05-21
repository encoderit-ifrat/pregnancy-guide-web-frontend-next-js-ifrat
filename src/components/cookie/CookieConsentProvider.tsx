"use client";

import React, { useEffect, useState } from "react";
import {
  getConsent,
  setConsent,
  CONSENT_ACCEPTED,
  CONSENT_DECLINED,
} from "@/lib/consent";
import CookieConsentBanner from "./CookieConsentBanner";
import MetaPixelTracker from "./MetaPixelTracker";

export default function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsentState] = useState<string | null>(null);

  useEffect(() => {
    setConsentState(getConsent());
  }, []);

  const handleAccept = () => {
    setConsent(CONSENT_ACCEPTED);
    setConsentState(CONSENT_ACCEPTED);
  };

  const handleDecline = () => {
    setConsent(CONSENT_DECLINED);
    setConsentState(CONSENT_DECLINED);
  };

  const showBanner = consent === null;

  return (
    <>
      {showBanner && (
        <CookieConsentBanner
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
      <MetaPixelTracker />
      {children}
    </>
  );
}
