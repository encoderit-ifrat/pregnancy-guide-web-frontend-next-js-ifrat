import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type IconHeadingProps = {
  text: string;
  icon?: ReactNode;
  className?: string;
  image?: string;
};

export default function IconHeading({
  text,
  icon,
  className = "",
  image,
}: IconHeadingProps) {
  return (
    <div className={cn(`flex items-center gap-4 mb-2 md:mb-4`, className)}>
      {icon && <span className="h-6 w-6">{icon}</span>}
      {image && <span>
        <Image
          src={image}
          alt=""
          width={60}
          height={60}
          className="w-6 h-6 md:w-8 md:h-8"
        />
      </span>}
      <span className="text-[20px] md:text-[25px]">{text}</span>
    </div>
  );
}
