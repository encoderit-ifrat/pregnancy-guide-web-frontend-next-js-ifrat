"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useTranslation } from "@/providers/I18nProvider";

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    company: [
      { href: "/about", label: t("footer.delivery") },
      { href: "/contact", label: t("footer.pregnancyHealth") },
      { href: "/careers", label: t("footer.foodAndDiet") },
      { href: "/careers", label: t("footer.pregnancy") },
    ],
    resources: [
      { href: "/blog", label: t("footer.home") },
      { href: "/articles", label: t("footer.articles") },
      { href: "/faq", label: t("footer.feedback") },
      { href: "/faq", label: t("footer.settings") },
    ],
    legal: [
      { href: "/privacy", label: t("footer.termsConditions") },
      { href: "/terms", label: t("footer.privacyPolicy") },
    ],
  };

  return (
    <footer className="bg-primary relative overflow-hidden">
      <div className="container-xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 pb-10">
          {/* Logo and Description */}
          <div className="col-span-4 lg:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo/logo-light.png"
                alt="Familj"
                width={100}
                height={50}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Links Columns */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-[25px] tracking-wider text-white!">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={link.href + index}>
                  <Link
                    href={link.href}
                    className="text-lg text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-[25px] tracking-wider text-white!">
              {t("footer.additionalLink")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={link.href + index}>
                  <Link
                    href={link.href}
                    className="text-lg text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 lg:col-span-1">
            <h4 className="mb-4 text-[25px] tracking-wider text-white!">
              {t("footer.socialLink")}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={social.href + index}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t text-[15px] border-white/10 mb-8 md:mb-0">
          <div className="flex flex-col md:items-center justify-between gap-4 md:flex-row">
            <p className="text-white/60!">
              {t("footer.copyright", {
                year: new Date().getFullYear().toString(),
              })}
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={link.href + index}
                  href={link.href}
                  className="text-white/60! transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
