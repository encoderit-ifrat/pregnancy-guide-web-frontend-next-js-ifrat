import Image from "next/image";
import Link from "next/link";
import WaveLeaf from "@/components/layout/svg/WaveLeaf";

export function HeroSection() {
  return (
    <section className="relative bg-[#F6F0FF] pt-2 pb-0 md:pb-16 lg:pb-0">
      <div className="container-xl md:mb-4">
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="order-1 text-center lg:order-1 lg:text-left">
            <h1 className="mb-4 text-[40px] font-bold leading-tight text-text-primary md:text-[55px]">
              <span className="font-normal text-primary">Companion</span>
              <br />
              <span className="font-bold md:font-black text-primary-dark">
                During Pregnancy
              </span>
            </h1>
            <p className="mt-3.75 lg:mt-6.25 mx-auto mb-8 font-outfit text-base leading-relaxed text-text-secondary lg:mx-0 lg:text-base text-center md:text-left">
              Discover Familj, your trusted companion throughout every stage of
              pregnancy, offering personalized weekly insights, expert articles,
              and gentle guidance to make your journey feel safe and supported.
            </p>

            {/* App Store Badges */}
            <div className="flex items-center justify-center md:justify-start gap-4 lg:items-start">
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

            {/* Carousel Dots */}
            <div className="mt-8 flex justify-center gap-2 lg:justify-start">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-primary-muted" />
              <span className="h-2 w-2 rounded-full bg-primary-muted" />
              <span className="h-2 w-2 rounded-full bg-primary-muted" />
            </div>
          </div>

          {/* Tree Illustration */}
          <div className="order-2 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/hero/egg-tree.png"
                alt="Tree of life illustration"
                width={500}
                height={600}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <WaveLeaf className="text-[#FFFFFF] absolute bottom-0 left-0 right-0 z-1" />
    </section>
  );
}
