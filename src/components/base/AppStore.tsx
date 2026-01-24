import React from "react";
import ButtonStore from "../ui/ButtonStore";

export default function AppStore() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center sm:justify-start">
      <ButtonStore
        src="/assets/logo/googleApp.svg"
        alt="Google Play"
        href="https://play.google.com"
        className="w-full sm:w-auto"
      />
      <ButtonStore
        src="/assets/logo/appleApp.svg"
        alt="Google Play"
        href="https://play.google.com"
        className="w-full sm:w-auto"
      />
    </div>
  );
}
