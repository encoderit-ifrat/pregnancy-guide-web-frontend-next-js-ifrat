import WaveDivider from "@/components/layout/svg/WaveDivider";
import { cn } from "@/lib/utils";
import React from "react";

export function PageContainer({
  className,
  children,
  waaveClassName,
}: {
  className?: string;
  waaveClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={cn("relative min-h-svh", className)}>
        <section className="absolute bg-[#F6F0FF] top-0 left-0 w-full h-[60vh] z-10">
          <div className="h-[50vh]"></div>
          <WaveDivider
            className={cn(
              "text-white transform translate-y-px",
              waaveClassName
            )}
            bgClassName="bg-[#F6F0FF]"
            height="h-26 lg:h-auto"
          />
        </section>
        <div className="relative z-20 px-4 py-10">{children}</div>
      </div>
    </>
  );
}
