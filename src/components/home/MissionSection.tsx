import Image from "next/image";
import { Download, Heart } from "lucide-react";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import WaveLeaf from "../layout/svg/WaveLeaf";
import React from "react";

export function MissionSection() {
  return (
    <section className="relative pt-6 pb-16 md:py-24">
      {/* <WaveLeaf
        className="text-[#FFFFFF] absolute top-0 left-0 right-0 z-[1]"
        bgClassName="bg-primary!"
      /> */}

      <div className="container-xl max-w-6xl">
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="order-2 md:order-1 flex justify-center lg:justify-end">
            <div className="relative overflow-hidden rounded-3xl shadow-lg">
              <Image
                src="/images/track-week/1.png"
                alt="Baby feet"
                width={420}
                height={420}
                className="h-[361px] w-[365.02px] md:h-[420px] md:w-[420px] object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 text-center md:text-left">
            {/* Section Label */}
            <IconHeading
              text="Mission"
              icon={<Heart />}
              className="text-primary justify-center md:justify-start"
            />
            <SectionHeading>Our Mission</SectionHeading>

            <p className="mx-auto max-w-xl lg:mx-0">
              Aenean congue vehicula lacinia. Sed nec varius velit. Suspendisse
              vitae risus et nulla blandit condimentum. Nunc pellentesque, felis
              ac pretium malesuada, nisi elit ullamcorper purus, vel aliquet
              felis justo sed quam. Cras consequat lobortis dui, ut auctor elit
              porta vitae. Suspendissecommodo vulputate congue. Cras nec dui e
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
