import React from "react";
import ForgotPassword from "./_component/ForgotPasswordForm";
import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-svh  md:pb-96">
      <div className="flex items-center justify-center  p-4 pt-24">
        <ForgotPassword />
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
