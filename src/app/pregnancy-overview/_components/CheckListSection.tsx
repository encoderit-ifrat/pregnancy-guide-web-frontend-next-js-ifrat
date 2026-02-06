import React from "react";
import WaveDivider2 from "@/components/layout/svg/WaveDivider2";
import IconHeading from "@/components/ui/text/IconHeading";
import { Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import WaveDivider3 from "@/components/layout/svg/WaveDivider3";

export default function CheckListSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative w-full mx-auto">
      <div>
        {/* Background image */}
        <div className="absolute inset-0 z-0 bg-[url('/images/checklist-bg.png')] bg-cover bg-center" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#240443] to-[#230343]/0 pointer-events-none" />
        {/* Overlay image */}
        <div className="absolute inset-0 z-20 bg-[url('/images/heart-bg.png')] bg-cover bg-center opacity-10" />

        {/* Content */}
        <div className="relative z-30">
          <WaveDivider2
            waveColorClass="text-white"
            bgClassName="bg-transparent"
          />
          <div className="">
            <div className="text-center text-white">
              <IconHeading
                text="Our CHECKLISTS"
                icon={<Heart />}
                className="text-white justify-center"
              />
              <SectionHeading className="text-white">Checklists</SectionHeading>
              <p className="max-w-105 mx-auto">
                Expert advice, real stories, and helpful tips to support you and
                your family at every stage.
              </p>
            </div>
            {children}
          </div>
          <WaveDivider3
            waveColorClass="text-primary-light transform translate-y-[2px]"
            bgClassName="bg-transparent"
          />
        </div>
      </div>
    </section>
  );
}
