import React from "react";

export default function EllipseSVG(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 100 25"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M0,25 Q50,-10 100,25 Z" />
    </svg>
  );
}
