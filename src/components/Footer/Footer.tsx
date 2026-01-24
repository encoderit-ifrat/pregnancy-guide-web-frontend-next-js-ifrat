"use client";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Footer() {
  const { user, isAuthenticated } = useCurrentUser();
  return (
    <div className="relative ">
      <div className="absolute -translate-y-full w-full">
        <Image
          src="/assets/logo/vectorSecond.svg"
          alt="Wave"
          width={1920}
          height={239}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      {/* Footer Section */}
      <section className="relative bg-soft mt-1">
        <footer className=" text-soft-white text-center ">
          {/* Logo Image */}
          <div className="mb-6 flex flex-col items-center">
            <Image
              src="/assets/logo/footerImg.svg"
              alt="Familj Logo"
              width={243}
              height={124}
              className="h-auto w-[100px] md:w-[243px] object-contain"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-2 text-xs lg:text-sm mb-6">
            <Link
              href={isAuthenticated ? "/pregnancy-overview" : "/"}
              className="hover:underline"
            >
              Home
            </Link>
            <span>|</span>
            <Link href="/search-article" className="hover:underline">
              Articles
            </Link>
            <span>|</span>
            <Link href="/contact-us" className="hover:underline">
              Feedback
            </Link>
            <span>|</span>
            <Link href="/" className="hover:underline">
              Settings
            </Link>
            <span>|</span>
            <Link href="/" className="hover:underline">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/" className="hover:underline">
              Privacy Policy
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-4 mb-6">
            <Link
              href="#"
              className="bg-soft-white text-secondary w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition"
            >
              <FaFacebookF size={18} />
            </Link>
            <Link
              href="#"
              className="bg-soft-white text-secondary w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition"
            >
              <FaTwitter size={18} />
            </Link>
            <Link
              href="#"
              className="bg-soft-white text-secondary w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition"
            >
              <FaInstagram size={18} />
            </Link>
            <Link
              href="#"
              className="bg-soft-white text-secondary w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition"
            >
              <FaYoutube size={18} />
            </Link>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/40 py-4 text-xs lg:text-lg whitespace-nowrap overflow-hidden">
            Copyright © 2025 <span className="text-secondary ">Familj.se.</span>{" "}
            All Right Reserved.
          </div>
        </footer>
      </section>
    </div>
  );
}
