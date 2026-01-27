import clsx from "clsx";

type WaveDividerProps = {
  className?: string;     // controls wave (fill) color
  height?: string;        // controls svg height
  bgClassName?: string;   // controls wrapper background
};

export default function WaveLeaf({
                                   className = "text-purple-50",
                                   height = "h-32 sm:h-40 lg:h-auto",
                                   bgClassName = "bg-transparent",
                                 }: WaveDividerProps) {
  return (
      <div className={clsx("w-full bg-red-400", bgClassName)}>
        <svg
            className={clsx(
                "hidden md:block w-full fill-current max-w-none shrink-0 -mb-1",
                height,
                className
            )}
            viewBox="0 0 1366 120"
            preserveAspectRatio="xMidYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <path
              d="M540.5 62.2028C286.1 125.803 74.1667 88.7028 0 62.2028V118.203H1440.5V84.2029C1399.5 93.7029 1274.5 89.2029 1195.5 62.2028C1032.5 0.202843 858.5 -17.2972 540.5 62.2028Z"
              fill="white"
          />
          <path
              d="M0 60.939C77.973 92.439 394.863 101.939 571.802 53.939C487.331 87.939 166.442 165.939 0 60.939Z"
              style={{fill: 'var(--primary)'}}
          />
          <path
              d="M1144.82 55.0708C1146.2 55.6986 1147.46 56.3218 1148.6 56.939C1147.35 56.3086 1146.09 55.6859 1144.82 55.0708C1100.42 34.8453 937.376 9.69491 847.207 17.939C889.166 5.1 1043.53 6.02216 1144.82 55.0708Z"
              style={{fill: 'var(--primary)'}}
          />
          <path
              d="M1171.62 63.1019C1166.19 54.1161 1152.35 53.4391 1146.1 56.939C1147.74 56.2064 1161.08 59.6482 1163.66 61.3927C1165.45 62.6065 1165.53 63.3109 1165.77 63.7993C1162.58 61.2598 1158.67 61.4741 1157.34 61.881C1157.34 63.5903 1161.79 69.1713 1164.59 68.2297C1167.09 67.3926 1171.23 69.2064 1173.02 69.939C1173.4 67.5949 1172.24 64.4042 1171.62 63.1019Z"
              style={{fill: 'var(--primary)'}}
          />
        </svg>
        <svg
            className={clsx(
                "block md:hidden w-full fill-current max-w-none shrink-0 -mb-1",
                height,
                className
            )}
            // width="393"
            // height="98"
            viewBox="0 0 393 98"
            preserveAspectRatio="xMaxYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <path
              d="M393 38.7623C265.476 9.66072 77.8648 60.522 0 89.5903V97.065H393V38.7623Z"
              fill="white"
          />
          <path
              d="M337.362 41.7913C338.396 42.0246 339.352 42.2711 340.224 42.5307C339.275 42.2778 338.321 42.0313 337.362 41.7913C304.04 34.2736 188.682 40.3413 128.053 58.8819C154.979 44.0832 260.919 22.6497 337.362 41.7913Z"
              style={{fill: 'var(--primary)'}}
          />
          <path
              d="M356.88 43.4653C351.873 38.0821 342.289 39.5966 338.511 42.8879C339.529 42.1516 349.166 42.6036 351.181 43.4313C352.582 44.0073 352.738 44.4786 352.969 44.7799C350.424 43.4942 347.769 44.2009 346.918 44.6695C347.163 45.8411 351.009 49.031 352.8 47.984C354.392 47.0532 357.485 47.7055 358.82 47.9511C358.742 46.2908 357.494 44.2688 356.88 43.4653Z"
              style={{fill: 'var(--primary)'}}
          />
        </svg>
      </div>
  );
}
