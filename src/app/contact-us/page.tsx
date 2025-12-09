import React from "react";
import ContactUsForm from "./_component/ContactUsForm";
import Image from "next/image";

export default function page() {
  return (
    <div className="pb-56">
      <div className=" flex items-center justify-center pb-20  p-4 pt-24">
        <ContactUsForm />
      </div>
      {/* <Image
        src="/assets/logo/vectorSecond.svg"
        alt="Wave"
        width={1920}
        height={239}
        className="w-full h-auto object-cover"
        priority
      /> */}
    </div>
  );
}
