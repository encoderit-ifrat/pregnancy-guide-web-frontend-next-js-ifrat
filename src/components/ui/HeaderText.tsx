import React from "react";
import { Playfair_Display, Poppins } from "next/font/google";

// Fonts
const playfair = Playfair_Display({
  weight: ["500"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["900"],
  subsets: ["latin"],
});

type TextProps = {
  commonText: string;
  boldText: React.ReactNode;
  color?: string;
  commonClass?: string;
  boldClass?: string;
  commonTextShadow?: string; // shadow for h5
  boldTextShadow?: string; // shadow for p
};

export default function HeaderText({
  commonText,
  boldText,
  color,
  commonClass,
  boldClass,
  commonTextShadow,
  boldTextShadow,
}: TextProps) {
  return (
    <div>
      <p
        className={`${playfair.className} font-medium leading-snug   ${commonClass}`}
        style={{
          color: color || "var(--color-text-light-purple)",
          textShadow: commonTextShadow || undefined,
        }}
      >
        {commonText}
      </p>

      <p
        className={`${poppins.className} leading-snug truncate  w-full max-w-full ${boldClass}`}
        style={{
          color: color || "var(--color-text-light)",
          textShadow: boldTextShadow || undefined,
        }}
      >
        {boldText}
      </p>
    </div>
  );
}
