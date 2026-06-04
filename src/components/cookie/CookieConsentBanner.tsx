"use client";

import React, { useEffect, useState } from "react";

type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

export default function CookieConsentBanner({ onAccept, onDecline }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <>
      <style>{`
        .familj-cc {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 9999;
          width: 340px;
          max-width: calc(100vw - 40px);
          background: #ffffff;
          border: 1px solid #e8e1f2;
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(93, 63, 142, 0.18);
          padding: 22px 22px 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          color: #2e2640;
          transform: translateY(20px);
          opacity: 0;
          transition: transform .35s cubic-bezier(.16,1,.3,1), opacity .35s ease;
        }
        .familj-cc.is-visible { transform: translateY(0); opacity: 1; }
        .familj-cc__title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #5d3f8e;
        }
        .familj-cc__text {
          font-size: 13.5px;
          line-height: 1.5;
          margin: 0 0 16px;
          color: #4a4358;
        }
        .familj-cc__text a { color: #5d3f8e; text-decoration: underline; }
        .familj-cc__buttons { display: flex; flex-direction: column; gap: 8px; }
        .familj-cc__btn {
          width: 100%;
          border: none;
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: transform .12s ease, background .2s ease, border-color .2s ease;
        }
        .familj-cc__btn:active { transform: scale(.98); }
        .familj-cc__btn--all {
          background: #8b6fc7;
          color: #ffffff;
        }
        .familj-cc__btn--all:hover { background: #7a5cb8; }
        .familj-cc__btn--necessary {
          background: #ffffff;
          color: #5d3f8e;
          border: 1.5px solid #c9b8e6;
        }
        .familj-cc__btn--necessary:hover { border-color: #8b6fc7; }
        @media (max-width: 480px) {
          .familj-cc { right: 12px; left: 12px; bottom: 12px; width: auto; }
        }
      `}</style>
      <div
        id="familjCookieConsent"
        className={`familj-cc${visible ? " is-visible" : ""}`}
        role="dialog"
        aria-live="polite"
        aria-label="Samtycke till kakor"
      >
        <p className="familj-cc__title">Vi använder kakor</p>
        <p className="familj-cc__text">
          Vi använder kakor för att sajten ska fungera och för att förstå hur
          den används. Vissa kakor är nödvändiga, andra hjälper oss att
          förbättra Familj.se och visa relevant innehåll. Du väljer själv vad
          du vill tillåta.
        </p>
        <div className="familj-cc__buttons">
          <button
            className="familj-cc__btn familj-cc__btn--all"
            onClick={onAccept}
          >
            Tillåt alla
          </button>
          <button
            className="familj-cc__btn familj-cc__btn--necessary"
            onClick={onDecline}
          >
            Endast nödvändiga
          </button>
        </div>
      </div>
    </>
  );
}
