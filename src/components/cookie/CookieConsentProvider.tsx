"use client";

import React, { useEffect, useState } from "react";
import {
  getConsent,
  setConsent,
  CONSENT_ALL,
  CONSENT_NECESSARY,
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
    setConsent(CONSENT_ALL);
    setConsentState(CONSENT_ALL);
  };

  const handleDecline = () => {
    setConsent(CONSENT_NECESSARY);
    setConsentState(CONSENT_NECESSARY);
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
