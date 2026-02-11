import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  company: [
    { href: "/about", label: "Förlossning" },
    { href: "/contact", label: "Gravidhälsa" },
    { href: "/careers", label: "Mat och kostråd" },
    { href: "/careers", label: "Graviditet" },
  ],
  resources: [
    { href: "/blog", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/faq", label: "Feedback" },
    { href: "/faq", label: "Settings" },
  ],
  legal: [
    { href: "/privacy", label: "Terms & Conditions" },
    { href: "/terms", label: "Privacy Policy" },
  ],
};

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

export function Footer() {
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
              Quick Links
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
              Additional Link
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
              Social Link
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
              Copyright © {new Date().getFullYear()} Familj.se. All Right
              Reserved.
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
