import React from "react";
import Image from "next/image";
import { getInitial } from "@/app/profile/_component/profile";

export default function BabyPercentage({
  percentage,
  profile,
}: {
  percentage: number;
  profile: any;
}) {
  return (
    <>
      {/*3d Baby progress*/}
      <div className="w-52 min-w-52 mx-auto">
        <div className="relative mx-auto rounded-full border-3 border-white shadow-lg">
          {/* Circular SVG Chart */}
          <svg
            viewBox="0 0 36 36"
            className="relative block w-full h-auto rotate-180"
          >
            {/* Background circle */}
            <path
              className="fill-none stroke-primary-light/80 stroke-2 stroke-linecap-round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className="fill-none stroke-primary stroke-2 stroke-linecap-round animate-[progress_1s_ease-out_forwards]"
              strokeDasharray={`${percentage || 0}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Dynamic circle at the end of progress */}
            <circle
              cx={
                18 + 15.9155 * Math.sin(((percentage || 0) * 2 * Math.PI) / 100)
              }
              cy={
                18 - 15.9155 * Math.cos(((percentage || 0) * 2 * Math.PI) / 100)
              }
              r="2"
              fill="white"
              stroke="#8B5CF6"
              strokeWidth="0.1"
              className="animate-[progress_1s_ease-out_forwards] shadow-[0_0_4px_rgba(0,0,0,0.9)]"
            />
            {/* Text inside the circle */}
            <text
              x={
                18 + 15.9155 * Math.sin(((percentage || 0) * 2 * Math.PI) / 100)
              }
              y={
                18 - 15.9155 * Math.cos(((percentage || 0) * 2 * Math.PI) / 100)
              }
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary font-bold text-[1.6px] -rotate-180 animate-[progress_1s_ease-out_forwards]"
              style={{
                transformOrigin: `${18 + 15.9155 * Math.sin(((percentage || 0) * 2 * Math.PI) / 100)}px ${18 - 15.9155 * Math.cos(((percentage || 0) * 2 * Math.PI) / 100)}px`,
              }}
            >
              {percentage || 0}%
            </text>
          </svg>

          {/* Center Image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-36 rounded-full overflow-hidden">
            {profile.upcoming ? (
              <Image
                src="/images/3d_baby.png"
                alt={profile.name || "Baby"}
                fill
                className="object-cover"
              />
            ) : profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name || "Baby"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-popover-foreground">
                {getInitial(profile.name)}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
