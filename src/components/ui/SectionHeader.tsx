// components/SectionHeader.tsx
"use client";

import React from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  titleClassName?: string;
  mainClassName?: string;
  descriptionClassName?: string;
};

const Header: React.FC<SectionHeaderProps> = ({
  title,
  description,
  titleClassName = "",
  descriptionClassName = "",
  mainClassName = "",
}) => {
  return (
    <div className={`text-center px-2 ${mainClassName}`}>
      <p
        className={`text-4xl md:whitespace-nowrap font-poppins font-semibold text-popover-foreground uppercase leading-10 ${titleClassName}`}
      >
        {title}
      </p>

      {description && (
        <p
          className={`text-base font-roboto font-normal text-text-dark pb-8 lg:pb-14 lg:pt-3 leading-[22px] pt-4 ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default Header;
