import React from "react";
import Image from "next/image";

type TProps = {
  className?: string;
};

export default function IconMother({ className }: TProps) {
  return (
    <Image
      src="/images/mother.png"
      alt="Babu"
      width={443}
      height={380}
      className={className}
    />
  );
}
