"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Script from "next/script";
import { hasAcceptedConsent } from "@/lib/consent";

const PIXEL_ID = "2694273594279105";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default function MetaPixelTracker() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window.fbq === "undefined") {
      window.fbq = function (...args: any[]) {
        window.fbq.callMethod
          ? window.fbq.callMethod(...args)
          : window.fbq.queue.push(args);
      };
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      window.fbq.queue = [];
    }
  }, []);

  useEffect(() => {
    if (!hasAcceptedConsent()) return;

    if (!initialized.current) {
      window.fbq("init", PIXEL_ID);
      initialized.current = true;
    }

    window.fbq("track", "PageView");
  }, [pathname]);

  if (!hasAcceptedConsent()) return null;

  return (
    <Script
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
    />
  );
}
