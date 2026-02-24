"use client";
"use client";

import React from "react";
import { useTranslation } from "@/providers/I18nProvider";
import { Button } from "../ui/Button";
import Image from "next/image";

function PregnancyError({ error }: { error: string }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{t("pregnancy.error")}: {error}</p>
          <Button onClick={() => window.location.reload()} variant={"purple"}>
            Retry
          </Button>
        </div>
      </div>
      <section>
        <Image
          src="/assets/logo/waveThird.svg"
          alt="Wave"
          width={1920}
          height={239}
          className="object-cover w-full h-auto"
          priority
        />
      </section>
    </div>
  );
}

export default PregnancyError;
