"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  useVerifyEmail,
  verifyEmailRequestType,
} from "./_api/mutations/useVerifyEmail";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
};

const StatusContent = {
  [STATUS.VERIFYING]: {
    Icon: Loader2,
    iconClass: "w-16 h-16 text-primary animate-spin mx-auto mb-4",
    title: "Verifying Your Email",
    text: "Please wait while we verify your email address...",
  },
  [STATUS.SUCCESS]: {
    Icon: CheckCircle,
    iconClass: "w-16 h-16 text-green-500 mx-auto mb-4",
    title: "Email Verified!",
    button: { href: "/login", text: "Go to Login" },
  },
  [STATUS.ERROR]: {
    Icon: XCircle,
    iconClass: "w-16 h-16 text-red-500 mx-auto mb-4",
    title: "Verification Failed",
    button: { href: "/resend-verify-email", text: "Resend Verification Email" },
  },
};

export default function VerifyEmail() {
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [message, setMessage] = useState("");

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus(STATUS.ERROR);
      setMessage("No verification token found in URL");
      return;
    }
    const verifyData: verifyEmailRequestType = {
      token: token,
    };
    verifyEmailMutation.mutate(verifyData, {
      onSuccess: () => {
        setStatus(STATUS.SUCCESS);
        setMessage("Email verified successfully!");
      },
      onError() {
        setStatus(STATUS.ERROR);
        setMessage(
          "An error occurred during verification. Please try again later."
        );
      },
    });
  }, []);

  const { Icon, iconClass, title, text, button } = StatusContent[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Icon className={iconClass} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{text || message}</p>
        {button && (
          <a
            href={button.href}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold  transition-colors"
          >
            {button.text}
          </a>
        )}
      </div>
    </div>
  );
}
