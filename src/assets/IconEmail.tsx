import React from "react";

type IconEmailProps = {
  className?: string;
};

export default function IconEmail({ className }: IconEmailProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2" clipPath="url(#clip0_80_607)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.87531 -2.17737H18.1246C20.0735 -2.17737 20.7256 0.429055 19.0063 1.34674L10.8817 5.68358C10.3307 5.97771 9.66932 5.97771 9.1183 5.68358L0.993626 1.34674C-0.725607 0.429055 -0.0734978 -2.17737 1.87531 -2.17737ZM0.111946 2.99855C0.0788795 2.98093 0.0462962 2.96295 0.0141151 2.94469V8.43264C0.0141151 10.5008 1.69067 12.1774 3.75882 12.1774H16.2412C18.3093 12.1774 19.9859 10.5008 19.9859 8.43264V2.94469C19.9537 2.96295 19.9211 2.98089 19.888 2.99855L11.7634 7.33535C10.6614 7.92358 9.33862 7.92358 8.23662 7.33535L0.111946 2.99855Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_80_607">
          <rect className={className} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
