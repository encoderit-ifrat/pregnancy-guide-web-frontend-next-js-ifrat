import Image from "next/image";
import React from "react";

type AuthCardType = {
  image?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function AuthCard({
  image,
  title,
  description,
  children,
}: AuthCardType) {
  return (
    <div className="mb-10 sm:my-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto shadow-xl rounded">
      <div>
        {image && (
          <Image
            src={image}
            alt="Auth illustration"
            width={400}
            height={400}
            className="object-fit object-cover object-[0_25%] sm:object-[50%_50%] md:rounded max-h-64 sm:max-h-full sm:h-full w-full"
          />
        )}
      </div>
      <div className="z-[2] -translate-y-10 md:-translate-y-0 w-full rounded-3xl bg-white sm:w-full mx-auto flex items-center justify-center">
        <div className="w-full max-w-[500px] min-h-[500px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:p-10 lg:pt-14">
          <div className="my-5 !mb-6">
            {title && (
              <h3 className="text-4xl! sm:text-3xl! md:text-4xl! font-medium text-popover-foreground mb-2">
                {title}
              </h3>
            )}
            {description && <p className="text-lg">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
