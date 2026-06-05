import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Invisible placeholder to reserve the correct natural size of the image */}
      <Image
        src="/images/logo/logo-light.png"
        alt="Familj"
        width={60}
        height={20}
        className={cn("opacity-0", className)}
        priority
      />
      <Image
        src="/images/logo/logo-light.png"
        alt="Familj"
        width={60}
        height={20}
        className={cn(
          "absolute inset-0 transition-opacity duration-300 h-full w-full object-contain",
          className,
          dark ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        priority
      />
      <Image
        src="/images/logo/logo-dark.png"
        alt="Familj"
        width={60}
        height={20}
        className={cn(
          "absolute inset-0 transition-opacity duration-300 h-full w-full object-contain",
          className,
          dark ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        priority
      />
    </div>
  );
}
