import IconCircle from "@/assets/IconCircle";
import Image from "next/image";
import React from "react";
import AppStore from "../base/AppStore";
import Paragraph from "../base/Paragraph";
import HeaderText from "../ui/HeaderText";

function ContentDetailsLast() {
  return (
    <section className="py-20 px-4">
      <div className="bg-soft w-full max-w-5xl  rounded-2xl mx-auto flex flex-col md:flex-row gap-8 md:gap-[30px]">
        {/* Text content (Left) */}
        <div className="text-soft-white w-full md:w-1/2 flex flex-col justify-center text-center md:text-left p-6 md:p-10">
          <HeaderText
            commonText="Consectetu"
            boldText={"ETIAM PHAR ETRA PRETIM"}
            commonClass="text-[40px] md:text-[40px]"
            boldClass="text-[45px] md:text-[45px]"
          />
          <Paragraph className="text-sm md:text-base leading-relaxed text-soft-white">
            Vestibulum egestas justo a lacus sagittis, sit amet iaculis nisi
            ultrices. Curabitur blandit tempus ipsum, eget hendrerit lacus
            molestie sed. Vivamus dignissim ultrices porta. Quisque vel
            pellentesque tellus. Morbi id velit ac metus pulvinar cursus nec
            eget elit. Suspendisse turpis nisi, tincidunt vitae leo in, mollis
            dictum lectus. Suspendisse semper.
          </Paragraph>
          {/* Store buttons */}
          <AppStore />
        </div>

        {/* Image content (Right) */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative">
          <div className="relative w-full max-w-[390px] mx-auto">
            <div className="relative w-full">
              <IconCircle />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/logo/phone.svg"
              alt="Phone"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContentDetailsLast;
