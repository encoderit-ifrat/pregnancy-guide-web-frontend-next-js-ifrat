import React from "react";

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-6 text-4xl font-bold text-text-primary md:text-4xl lg:text-5xl">
    {children}
  </h2>
)