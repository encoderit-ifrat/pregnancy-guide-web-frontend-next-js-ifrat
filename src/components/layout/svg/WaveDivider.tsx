import {cn} from "@/lib/utils";

type WaveDividerProps = {
  className?: string; // controls wave (fill) color
  height?: string; // controls svg height
  bgClassName?: string; // controls wrapper background
};

export default function WaveDivider({
  className = "text-purple-50",
  height = "h-40 lg:h-auto",
  bgClassName = "bg-transparent",
}: WaveDividerProps) {
  return (
    <div className={cn("w-full", bgClassName)}>
      <svg
        className={cn(
          "block w-full fill-current max-w-none shrink-0 -mb-1",
          height,
          className
        )}
        viewBox="0 0 1441 110"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M540.5 53.2639C286.1 116.864 74.1667 79.7639 0 53.2639V109.264H1440.5V75.2639C1399.5 84.7639 1274.5 80.2639 1195.5 53.2639C1032.5 -8.73612 858.5 -26.2361 540.5 53.2639Z" />
      </svg>
    </div>
  );
}
