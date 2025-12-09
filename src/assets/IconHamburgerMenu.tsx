import React from "react";

export default function IconHamburgerMenu(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect opacity="0.4" width="32" height="3" rx="1.5" fill="currentColor" />
      <rect
        opacity="0.4"
        y="8"
        width="26"
        height="3"
        rx="1.5"
        fill="currentColor"
      />
      <rect
        opacity="0.4"
        y="16"
        width="22"
        height="3"
        rx="1.5"
        fill="currentColor"
      />
    </svg>
  );
}
