import * as React from "react";

type CircleIconProps = {
  children: React.ReactNode;
  className?: string;
  bgClass?: string;
};

export const CircleIcon: React.FC<CircleIconProps> = ({
  children,
  className = "",
  bgClass = "bg-primary-gradient",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${bgClass} ${className}`}
    >
      {children}
    </div>
  );
};
