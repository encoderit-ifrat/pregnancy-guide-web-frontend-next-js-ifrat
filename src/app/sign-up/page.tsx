import React from "react";
import RegisterForm from "./_component/SignUpForm";
import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-svh pb-32  md:pb-96">
      <div className="flex items-center justify-center  p-4 pt-24">
        <RegisterForm />
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
