import React from "react";
import Image from "next/image";

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
}

export default function VCard({ step }: { step: Step }) {
  return (
    <div className="group relative w-full  rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
      {/* Image Container with V-shape cutout */}
      <div className="relative overflow-hidden rounded-t-3xl">
        <Image
          src={step.image}
          alt={step.title}
          height={500}
          width={500}
          className="h-full w-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-110"
        />

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>

        {/* V-Shape SVG Overlay */}
        <svg
          className="absolute left-0 right-0 bottom-0 w-full -mb-px block"
          height="95"
          viewBox="0 0 400 95"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.0289 19.6399C3.93064 17.0213 0.385356 5.89198 0 0.654665V95H400V0C400 11.5221 390.751 17.4577 386.127 18.9853L350.289 27.4959C320.809 34.479 253.815 49.6659 229.48 56.3011C198.266 64.8118 197.11 64.1571 169.364 57.6105L97.6879 39.9345C74.7592 34.2608 26.1272 22.2586 15.0289 19.6399Z"
            fill="white"
          />
        </svg>

        {/* Number Badge */}
        <div className="absolute bottom-2 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-primary text-lg font-bold text-white shadow-lg transition-transform duration-300 z-20">
          {step.number}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-12 pt-2 text-center">
        <h3 className="text-xl md:text-[22px] mb-2 font-semibold font-poppins text-primary-dark">{step.title}</h3>
        <p>{step.description}</p>
      </div>
    </div>
  );
}
