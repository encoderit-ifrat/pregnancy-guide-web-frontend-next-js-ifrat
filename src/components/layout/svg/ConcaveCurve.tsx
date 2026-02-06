import clsx from "clsx";

type WaveDividerProps = {
  className?: string; // controls wave (fill) color
  height?: string; // controls svg height
  bgClassName?: string; // controls wrapper background
};

export default function ConcaveCurve({
  className = "text-primary-light",
  height = "h-20 lg:h-auto",
  bgClassName = "bg-transparent",
}: WaveDividerProps) {
  return (
    <div className={clsx("w-full", bgClassName)}>
      <svg
        className={clsx(
          "block w-full fill-current max-w-none shrink-0 -mb-1",
          height,
          className
        )}
        viewBox="0 0 1442 93"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M0 92.7615C216.333 22.7615 807.5 -75.2385 1441.5 92.7615H0Z" />
      </svg>
    </div>
  );
}
