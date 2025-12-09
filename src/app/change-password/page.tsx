import React from "react";
import UpdatePasswordForm from "./_component/UpdatePasswordForm";
import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-svh pb-32  md:pb-96">
      <div className="flex items-center justify-center pt-28 lg:pt-33 pb-20 lg:pb-60 p-4">
        <UpdatePasswordForm />
      </div>
      {/* <div className="relative w-full z-10">
        <Image
          src="/assets/logo/vectorSecond.svg"
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
      </div> */}
    </div>
  );
}
