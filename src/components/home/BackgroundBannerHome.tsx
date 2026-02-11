"use client";

import Image from "next/image";
import React from "react";
import HeaderText from "../ui/HeaderText";
import AppStore from "../base/AppStore";

function BackgroundBannerHome() {
  return (
    <section className="flex justify-between flex-col items-center relative w-full overflow-hidden bg-[url('/assets/logo/bg.svg')] bg-center bg-cover">
      {/* Overlay Image */}
      {/* 
      <div className="absolute inset-0 w-full h-full ">
        <Image
          src="/assets/logo/layoutFirst.svg"
          alt="Overlay"
          fill
          className="object-cover mix-blend-hard-light pointer-events-none"
        />
      </div> */}

      {/* Overlay Image */}
      <div className="absolute inset-0 bg-[url('/assets/logo/layoutFirst.svg')] size-full z-10" />

      {/* Content Container */}
      <div className="relative  z-10 w-full h-full px-4 max-w-5xl mx-auto  pt-12 sm:pt-16 lg:pt-20 pb-45 sm:pb-50">
        <div className="h-full flex flex-col justify-center sm:justify-end">
          {/* Text Content Wrapper - Positioned well above the wave */}
          <div className="text-center mt-10 sm:text-left w-full  max-w-5xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            {/* Heading */}
            <HeaderText
              commonText="Your digital"
              boldText={
                <>
                  COMPANION <br /> DURING PREGNANCY
                </>
              }
              commonClass="text-[28px] xs:text-[32px] sm:text-[40px] lg:text-5xl lg:text-[55px] xl:text-[60px] leading-tight"
              boldClass="text-[32px] xs:text-4xl sm:text-4xl lg:text-[55px] lg:text-[65px] xl:text-[70px] leading-tight whitespace-nowrap"
              commonTextShadow="0px 2px 3px var(--color-shadow-text)"
              boldTextShadow="0px 3px 5px var(--color-shadow-text)"
            />

            {/* App Store Buttons - Safe margin from wave */}
            <div className="mt-6 sm:mt-8 lg:mt-10">
              <AppStore />
            </div>
          </div>
        </div>
      </div>

      {/* Wave SVG at Bottom - Always at the very bottom */}
      <div className="relative w-full z-10">
        <Image
          src="/assets/logo/vector.svg"
          alt="Wave"
          width={1920}
          height={239}
          priority
          sizes="100vw"
          className="w-full h-auto object-cover block"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}

export default BackgroundBannerHome;
