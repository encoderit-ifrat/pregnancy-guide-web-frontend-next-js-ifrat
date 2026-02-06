import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
// import { ConcaveCurve } from "@/components/layout/svg/ConcaveCurve";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

export function AppShowcaseSection() {
  return (
    <section className="relative bg-primary-light pt-10 pb-20">
      {/* Curved Backgrounds */}
      {/* <div className="absolute left-0 right-0 top-0 h-24 bg-white curved-top" /> */}
      <div className="max-w-7xl relative mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Section Label */}
            <IconHeading
              text="Pellentesque"
              icon={<Sparkles />}
              className="text-primary justify-center lg:justify-start"
            />
            <SectionHeading>
              Impersapienrhoncus
              <br />
              Etiampharetra
            </SectionHeading>

            <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-text-secondary lg:mx-0 lg:text-lg">
              Vestibulum egestas justo a lacus sagittis, sit amet iaculis nisi
              ultrices. Curabitur blandit tempus ipsum, eget hendrerit lacus
              molestie sed. Vivamus dignissim ultrices porta. Quisque vel
              pellentesque tellus. Morbi id velit ac metus pulvinar cursus nec
              eget elit. Suspendisse turpis nisi, tincidunt vitae leo in, mollis
              dictum lectus. Suspendisse semper.
            </p>
          </div>

          {/* Phone Mockups Placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/images/mobiles.png"
                alt="App screenshot"
                width={600}
                height={400}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
