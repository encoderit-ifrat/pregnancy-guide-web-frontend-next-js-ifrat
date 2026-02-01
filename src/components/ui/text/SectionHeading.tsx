import React from "react";
import { cn } from "@/lib/utils";

export const SectionHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={cn(
      "mb-4 text-4xl md:text-4xl lg:text-5xl font-semibold text-primary-dark leading-[1.4]",
      className
    )}
  >
    {children}
  </h2>
);
