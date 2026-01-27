import React from "react";

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-6 text-4xl md:text-4xl lg:text-5xl font-semibold text-primary-dark
  leading-[1.4]">
    {children}
  </h2>
)