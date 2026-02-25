import React from "react";
import Image from "next/image";

export default function Logo({ dark = false }) {
  const logoSrc = dark
    ? "/images/logo/logo-dark.png"
    : "/images/logo/logo-light.png";
  return (
    <>
      <Image
        src={logoSrc}
        alt="Familj"
        width={60}
        height={30}
        className="h-10 w-auto md:h-10"
        priority
      />
    </>
  );
}
