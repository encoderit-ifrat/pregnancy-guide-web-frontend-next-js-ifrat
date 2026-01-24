import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type StoreButtonProps = {
  src?: string;
  alt?: string;
  href: string;
  className?: string;
};

export default function ButtonStore({
  src,
  alt = "",
  href,
  className,
}: StoreButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex items-center justify-center transition", className)}
    >
      <div className="relative w-full sm:w-[204px] h-[64px]">
        {src && <Image src={src} alt="alt" fill className="object-contain" />}
      </div>
    </a>
  );
}
