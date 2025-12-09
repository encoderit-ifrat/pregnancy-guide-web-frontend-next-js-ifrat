import React from "react";
import ChangePasswordForm from "./_component/ChangPasswordForm";
import Image from "next/image";

export default function page() {
  return (
    <div className="pb-56">
      <div className="flex items-center justify-center pt-28 lg:pt-33 pb-20 lg:pb-60 p-4">
        <ChangePasswordForm />
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
