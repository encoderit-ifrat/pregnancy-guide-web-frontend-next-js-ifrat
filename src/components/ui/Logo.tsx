import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({
  className = "w-16 h-16",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <>
      <Image
        src={
          dark ? "/images/logo/logo-dark.png" : "/images/logo/logo-light.png"
        }
        alt="Familj"
        width={60}
        height={20}
        className={cn(className)}
        priority
      />
    </>
  );
}
