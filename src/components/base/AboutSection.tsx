import Image from "next/image";
import React from "react";
import HeaderText from "../ui/HeaderText";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-soft  relative flex justify-center flex-col items-center">
      <div className="py-20">
        <div className="w-full max-w-5xl rounded-2xl  flex flex-col lg:flex-row gap-12 lg:gap-8">
          {/* Left side - IconMom */}
          <div className="flex sm:justify-center lg:justify-start lg:w-1/3">
            <Image
              src="/assets/logo/about.svg"
              alt="about"
              width={661}
              height={679}
            />
          </div>
          {/* Right side - TrackCards */}
          <div className="flex flex-col gap-4 lg:w-2/3 p-2 text-center lg:text-left sm:items-center sm:justify-center">
            <div>
              <HeaderText
                commonText={"About"}
                boldText={"FAMILJ.SE"}
                commonClass="text-[40px] md:text-[40px]"
                boldClass="text-[45px] md:text-[45px]"
              />
              <p className="text-soft-white text-sm p-4">
                Vestibulum egestas justo a lacus sagittis, sit amet iaculis nisi
                ultrices. Curabitur blandit tempus ipsum, eget hendrerit lacus
                molestie sed. Vivamus dignissim ultrices porta. Quisque vel
                pellentesque tellus. Morbi id velit ac metus pulvinar cursus nec
                eget elit. Suspendisse turpis nisi, tincidunt vitae leo in,
                mollis dictum lectus. Suspendisse semper euismod velit eget
                aliquet. Proin suscipit, est congue fermentum ornare, nunc leo
                semper dolor, non vulputate elit libero.
              </p>
              <h4 className="text-soft-white  text-2xl py-4">Our Mission</h4>
              <p className="text-soft-white text-sm p-4">
                Aenean congue vehicula lacinia. Sed nec varius velit.
                Suspendisse vitae risus et nulla blandit condimentum. Nunc
                pellentesque, felis ac pretium malesuada, nisi elit ullamcorper
                purus, vel aliquet felis justo sed quam. Cras consequat lobortis
                dui, ut auctor elit porta vitae. Suspendisse commodo vulputate
                congue. Cras nec dui e
              </p>
            </div>

            <div className="w-full flex justify-center lg:justify-start ">
              <Button asChild variant="purple" size="sm" className="text-sm ">
                <a href="#">
                  CONTACT US
                  <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
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
    </section>
  );
}
