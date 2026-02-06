import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import IconHeading from "@/components/ui/text/IconHeading";

export function DownloadCtaSection() {
  return (
    <section className="bg-black relative overflow-hidden pb-10 pt-36 md:py-24">
      {/* Right-side Background Image (absolute) */}
      <div className="absolute inset-y-0 right-0 max-h-2/4 w-full md:max-h-full md:max-w-2/3">
        <Image
          src="/images/233.jpg"
          alt=""
          fill
          className="object-cover object-right w-full origin-bottom-right"
        />
      </div>

      {/*Gradient Overlay*/}
      <div
        className="
    absolute inset-0
     bg-[linear-gradient(to_top,#240443_0%,#240443_50%,transparent_100%)]
     md:bg-[linear-gradient(to_right,#240443_0%,#240443_25%,#240443_36%,transparent_80%,transparent_100%)]
     lg:bg-[linear-gradient(to_right,#240443_0%,#240443_25%,#240443_40%,transparent_90%,transparent_100%)]
pointer-events-none
  "
      />
      <div className="max-w-7xl relative z-10 mx-auto px-4">
        <div>
          {/* Section Label */}
          <IconHeading
            text="Consectetu"
            icon={<Download />}
            className="text-white/80"
          />

          <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Etiam phar etr...
          </h2>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/80 md:text-md">
            Vestibulum egestas justo a lacus sagittis, sit amet iaculis nisi
            ultrices. Curabitur blandit tempus ipsum, eget hendrerit lacus
            molestie sed. Vivamus dignissim ultrices porta. Quisque vel
            pellentesque tellus. Morbi id velit ac metus pulvinar cursus nec
            eget elit. Suspendisse turpis nisi, tincidunt vitae leo in, mollis
            dictum lectus. Suspendissesemper.
          </p>

          {/* App Store Badges */}
          <div className="flex gap-4 sm:flex-row">
            <Link href="#" className="transition-transform hover:scale-105">
              <Image
                src="/images/hero/app-store2.png"
                alt="Download on App Store"
                width={140}
                height={46}
                className="h-11 w-auto"
              />
            </Link>
            <Link href="#" className="transition-transform hover:scale-105">
              <Image
                src="/images/hero/google-play2.png"
                alt="Get it on Google Play"
                width={140}
                height={46}
                className="h-11 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
