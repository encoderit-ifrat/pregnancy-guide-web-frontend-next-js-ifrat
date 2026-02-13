import Image from "next/image";
import Link from "next/link";
import WaveLeaf from "@/components/layout/svg/WaveLeaf";
import WaveDivider from "@/components/layout/svg/WaveDivider";

export function HeroSection2({
  name,
  title,
  description,
  image,
}: {
  name: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section className="relative bg-[#F6F0FF] pt-2 pb-0 lg:pb-0">
      <div className="px-4 max-w-325 mx-auto w-full">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(540px,1.3fr)_1fr] lg:gap-12">
          {/* Content */}
          <div className="order-1 text-center lg:order-1 lg:text-left">
            <p className="text-primary text-[20px] md:text-[25px] mb-4">{name}</p>
            <h1 className="mb-4 text-[35px] font-bold leading-tight md:text-[55px] text-primary-dark">
              {title}
            </h1>
            <p className="mx-auto mb-8 text-sm leading-relaxed text-text-secondary lg:mx-0 lg:text-lg">
              {description}
            </p>
          </div>

          {/* Tree Illustration */}
          <div className="order-2 flex justify-center lg:order-2 lg:justify-end">
            {image && <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src={image}
                alt={''}
                width={500}
                height={600}
                className="h-auto w-full transform md:translate-y-5"
                priority
              />
            </div>}
          </div>
        </div>
      </div>

      <WaveDivider
        className="text-white transform translate-y-px"
        bgClassName="bg-[#F6F0FF]"
      />
    </section>
  );
}
