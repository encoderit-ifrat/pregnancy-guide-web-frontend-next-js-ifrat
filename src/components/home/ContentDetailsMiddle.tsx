import Image from "next/image";
import React from "react";
import HeaderText from "../ui/HeaderText";
import IconCircle from "@/assets/IconCircle";
import Paragraph from "../base/Paragraph";

function ContentDetailsMiddle() {
  return (
    <section className="relative w-full py-20 px-4 overflow-visible">
      <div className="bg-primary w-full max-w-5xl rounded-2xl mx-auto flex flex-col md:flex-row min-h-96 relative overflow-visible">
        {/* Left side — image area (with overflow) */}
        <div className="flex-1 shrink-0 relative flex items-center justify-center overflow-visible">
          <div className="relative w-full max-w-sm p-4 bg-radial from-black/20 from-20% via-transparent via-70% to-transparent rounded-full">
            <IconCircle />
            <div className="absolute top-0 -translate-y-4/12 left-1/2 -translate-x-1/2 w-full aspect-[9/16] overflow-visible z-10 scale-85 md:scale-95">
              <Image
                src="/assets/logo/mobile-group-crop.png"
                alt="Phone"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right side — text */}
        <div className="flex-1 p-6 flex items-center">
          <div className="space-y-4 sm:space-y-5 md:space-y-6 w-full max-w-full">
            <HeaderText
              commonText="Pellentesque"
              boldText="IMPERSAPIENRHONCUS ETIAMPHARETRA"
              commonClass="text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px] leading-tight"
              boldClass="text-[22px] sm:text-2xl md:text-4xl lg:text-[45px] leading-tight text-wrap"
            />
            <Paragraph className="text-sm sm:text-base md:text-base lg:text-lg text-soft-white leading-relaxed">
              Vestibulum egestas justo a lacus sagittis, sit amet iaculis nisi
              ultrices. Curabitur blandit tempus ipsum, eget hendrerit lacus
              molestie sed. Vivamus dignissim ultrices porta. Quisque vel
              pellentesque tellus. Morbi id velit ac metus pulvinar cursus nec
              eget elit. Suspendisse turpis nisi, tincidunt vitae leo in, mollis
              dictum lectus. Suspendisse semper.
            </Paragraph>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContentDetailsMiddle;
