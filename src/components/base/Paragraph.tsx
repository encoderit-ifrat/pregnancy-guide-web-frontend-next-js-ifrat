import React from "react";

type ParagraphProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Paragraph({
  children,
  className = "",
}: ParagraphProps) {
  return (
    <p
      className={`text-sm md:text-base leading-relaxed text-gray-800 ${className}`}
    >
      {children}
    </p>
  );
}
