import {cn} from "@/lib/utils";

type TopWaveDividerProps = {
  bgClassName?: string;     // section background (e.g. bg-red-500)
  waveColorClass?: string; // color of the wave edge
  height?: string;
};

export default function TopWaveDivider({
                                         bgClassName = "bg-transparent",
                                         waveColorClass = "text-red-200",
                                         height = "h-40 lg:h-auto",
                                       }: TopWaveDividerProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", bgClassName)}>
      <svg
        className={cn(
          "block w-full fill-current max-w-none shrink-0",
          height,
          waveColorClass
        )}
        viewBox="0 0 1441 97"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M492.266 73.3714C279.889 121.2 75.5984 85.4957 0 61.6651V0H1440V82.5692C1314.5 96.7688 1226.5 73.5141 1198 62.9049C946.422 -30.7454 757.737 13.5857 492.266 73.3714Z" fill="white"/>
      </svg>
    </div>
  );
}
