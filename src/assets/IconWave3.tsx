import React from "react";
type IconWaveProps = {
  className?: string;
};

export default function IconWave3({ className }: IconWaveProps) {
  return (
    <svg
      width="1820"
      height="354"
      viewBox="0 0 1820 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_77_497"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1820"
        height="354"
      >
        <path d="M1820 0H0V353.398H1820V0Z" fill="white" />
      </mask>

      <g mask="url(#mask0_77_497)">
        <mask
          id="mask1_77_497"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1820"
          height="354"
        >
          <path d="M1820 0H0V353.398H1820V0Z" fill="white" />
        </mask>

        <g mask="url(#mask1_77_497)">
          <path
            d="M49.0303 143.413C49.0303 143.413 337.334 272.989 754.125 127.319C1127.95 -5.10342 1402.76 180.281 1402.76 180.281C1402.76 180.281 1579.89 279.336 1738.79 138.048C1897.68 -3.23878 1723.16 352.416 1723.16 352.416H0L49.0303 143.413Z"
            fill="#AEA8FF"
          />
        </g>
      </g>

      {/* Repeat for mask2 → mask9 with style={{ maskType: 'luminance' }} */}
    </svg>
  );
}
