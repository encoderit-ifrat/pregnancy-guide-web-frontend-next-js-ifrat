import clsx from "clsx";

type WaveDividerProps = {
  className?: string;     // controls wave (fill) color
  height?: string;        // controls svg height
  bgClassName?: string;   // controls wrapper background
};

export default function FooterWaveDivider({
                                            className = "text-purple-50",
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
            viewBox="0 0 1443 145"
            preserveAspectRatio="xMidYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <path opacity="0.2" d="M1447.5 52.8936C1369.53 21.3935 1052.64 11.8935 875.699 59.8935C960.17 25.8935 1281.06 -52.1065 1447.5 52.8936Z" fill="#A97AEC"/>
          <path d="M1442.5 143H0V34.5C37.8333 29.3333 137.9 24.4 235.5 46C421.5 88.5 569 82 663 78.5C757 75 905 39 1083.5 28C1226.3 19.2 1382.33 37.7054 1442.5 48.0581V143Z" fill="#A97AEC"/>
        </svg>
      </div>
  );
}
