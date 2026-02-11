import React from "react";
import { cn } from "@/lib/utils";

export const SectionHeading = ({
  children,
  className,
  variant = "h1",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) => {
  const variantClasses = {
    h1: "mb-4 text-[35px] md:text-[45px] font-semibold font-poppins text-primary-dark leading-[1.4]",
    h2: "mb-4 text-3xl md:text-3xl lg:text-4xl font-semibold font-poppins  text-primary-dark leading-[1.4]",
    h3: "mb-4 text-3xl md:text-3xl lg:text-3xl font-semibold font-poppins text-primary-dark leading-[1.4]",
    h4: "mb-4 text-2xl md:text-2xl lg:text-2xl font-semibold font-poppins text-primary-dark leading-[1.4]",
    h5: "mb-4 text-lg md:text-lg lg:text-xl font-semibold font-poppins text-primary-dark leading-[1.4]",
    h6: "mb-4 text-md md:text-md lg:text-lg font-semibold font-poppins text-primary-dark leading-[1.4]",
  };

  return <h2 className={cn(variantClasses[variant], className)}>{children}</h2>;
};
