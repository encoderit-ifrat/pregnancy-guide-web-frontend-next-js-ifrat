import React from 'react';
type IconWaveProps = {
  className?: string;
};

export default function IconWave4({ className }: IconWaveProps) {
  return (
    <svg
      width="1820"
      height="344"
      viewBox="0 0 1820 344"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_77_347"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1820"
        height="344"
      >
        <path d="M1820 0H0V343.224H1820V0Z" fill="white" />
      </mask>

      <g mask="url(#mask0_77_347)">
        <mask
          id="mask1_77_347"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1820"
          height="344"
        >
          <path d="M1820 0H0V343.224H1820V0Z" fill="white" />
        </mask>

        <g mask="url(#mask1_77_347)">
          <path
            d="M49.0303 139.285C49.0303 139.285 337.334 265.13 754.125 123.653C1127.95 -4.95653 1402.76 175.091 1402.76 175.091C1402.76 175.091 1579.89 271.294 1738.79 134.074C1897.68 -3.14556 1723.16 342.271 1723.16 342.271H0L49.0303 139.285Z"
            fill="#F0E8FF"
          />
        </g>
      </g>

      {/* Repeat the same fix for mask2 → mask9 */}
    </svg>
  );
}
