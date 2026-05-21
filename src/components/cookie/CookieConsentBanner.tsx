"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

export default function CookieConsentBanner({ onAccept, onDecline }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Vi använder kakor</h2>
        <p className="text-text-dark mb-6 max-w-2xl leading-relaxed">
          Vi använder kakor för att sajten ska fungera och för att förstå hur
          den används. Vissa kakor är nödvändiga, andra hjälper oss att förbättra
          Familj.se och visa relevant innehåll. Du väljer själv vad du vill
          tillåta.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onAccept} size="lg">
            Tillåt alla
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            size="lg"
          >
            Endast nödvändiga
          </Button>
        </div>
      </div>
    </div>
  );
}
