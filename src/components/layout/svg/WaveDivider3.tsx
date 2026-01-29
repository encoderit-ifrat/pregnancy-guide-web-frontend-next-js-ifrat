import { cn } from "@/lib/utils";

type TopWaveDividerProps = {
  bgClassName?: string; // section background (e.g. bg-red-500)
  waveColorClass?: string; // color of the wave edge
  height?: string;
};

export default function WaveDivider3({
  bgClassName = "bg-transparent",
  waveColorClass = "text-primary-light",
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
        <path d="M492.266 23.6286C279.889 -24.1999 75.5984 11.5043 0 35.3349V97H1440V14.4308C1314.5 0.231155 1226.5 23.4859 1198 34.0951C946.422 127.745 757.737 83.4143 492.266 23.6286Z" />
      </svg>
    </div>
  );
}
