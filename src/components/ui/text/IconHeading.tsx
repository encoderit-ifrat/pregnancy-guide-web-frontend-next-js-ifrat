import { ReactNode } from "react";

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
    <div className={`mb-4 flex items-center gap-2 ${className}`}>
      <span className="h-5 w-5 mb-2">{icon}</span>
      <span className="text-2xl">{text}</span>
    </div>
  );
}
