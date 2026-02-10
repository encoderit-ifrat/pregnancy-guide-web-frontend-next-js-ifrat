import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IconHeadingProps = {
  text: string;
  icon: ReactNode;
  className?: string;
};

export default function IconHeading({
  text,
  icon,
  className = "",
}: IconHeadingProps) {
  return (
    <div className={cn(`flex items-center gap-4`, className)}>
      <span className="h-6 w-6">{icon}</span>
      <span className="text-[20px] md:text-[25px]">{text}</span>
    </div>
  );
}
