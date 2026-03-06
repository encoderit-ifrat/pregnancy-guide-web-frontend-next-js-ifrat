"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  threadId: string;
}

export default function ShareModal({
  open,
  onOpenChange,
  title,
  threadId,
}: ShareModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/discussion-threads/${threadId}`
      : `/discussion-threads/${threadId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(t("threads.linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t("threads.copyFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-semibold text-primary-color">
          {t("threads.shareThread")}
        </DialogTitle>

        <div className="flex flex-col gap-4 mt-4">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors w-full"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-primary-color font-medium">
              {copied ? t("threads.copied") : t("threads.copyLink")}
            </span>
          </button>

          <div className="flex gap-4 justify-center mt-2 flex-wrap">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={48} round />
            </FacebookShareButton>

            <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
              <WhatsappIcon size={48} round />
            </WhatsappShareButton>

            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={48} round />
            </LinkedinShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={48} round />
            </TwitterShareButton>

            <EmailShareButton
              url={shareUrl}
              subject={title}
              body="Check out this thread: "
            >
              <EmailIcon size={48} round />
            </EmailShareButton>
          </div>
        </div>

        {/* <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <span className="text-2xl">&times;</span>
        </DialogPrimitive.Close> */}
      </DialogContent>
    </Dialog>
  );
}
