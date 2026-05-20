import React from "react";
import { calculatePregnancyProgress } from "@/utlis/calculateDate";
import { PregnancyDetailsProps } from "../_types/pregnancy_details_types";
import { useTranslation } from "@/hooks/useTranslation";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Image from "next/image";

function PregnancyDetails({ userData, weeklyDetails }: PregnancyDetailsProps) {
  const { t, locale } = useTranslation();
  const htmlString = weeklyDetails?.description;

  const updatedHtml = htmlString?.replace("$name", userData?.name);
  const titledHtml = weeklyDetails?.title?.replace("$name", userData?.name);
  const pregnancyProgressInfo = calculatePregnancyProgress(
    userData?.details?.due_date || "",
    locale
  );

  const currentProgress = {
    ...pregnancyProgressInfo,
    ...(userData?.details?.current_pregnancy_data || {}),
  };

  return (
    <section className="w-full container-xl my-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6">
        <Cards className="px-6 py-6">
          <h3 className="text-primary-dark text-center text-lg md:text-[22px] font-semibold mb-2">
            {t(
              `pregnancy.trimesters.${currentProgress?.trimester?.toString().match(/\d/)?.[0] || "1"}`
            )}
          </h3>
          <div className="my-5">
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className="relative bg-primary h-4 rounded-full"
                style={{ width: `${currentProgress?.percentage || 0}%` }}
              >
                <div className="h-[38px] w-[38px] bg-white shadow-lg border border-black rounded-full absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 flex items-center justify-center">
                  <span className="text-primary text-xs  font-semibold">
                    {currentProgress?.percentage || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-center text-lg md:text-[22px] mb-2">
            <span className="text-primary-dark font-medium md:font-semibold">
              {pregnancyProgressInfo?.daysLeft || 0} {t("pregnancy.days")}
            </span>
          </h3>

          <h3 className="text-center text-primary-dark text-lg md:text-[22px] font-medium md:font-semibold">
            {t("pregnancy.dueDate")} {pregnancyProgressInfo?.dueDate || ""}
          </h3>
        </Cards>
        <Cards className="px-6 py-6">
          <h3 className="text-primary-dark text-center font-medium md:font-semibold mb-4 block">
            {titledHtml || t("checklists.form.description")}
          </h3>
          {weeklyDetails?.description && (
            <div
              className="weekly-details prose-p:text-center prose-h1:text-center prose-h2:text-center prose-h3:text-center prose-h4:text-center prose-h5:text-center prose-h6:text-center"
              dangerouslySetInnerHTML={{ __html: updatedHtml }}
            />
          )}
        </Cards>
        <Cards className="px-0 py-0">
          <div className="w-full h-full relative">
            <Image
              src={imageLinkGenerator(weeklyDetails?.image)}
              alt="img"
              className="w-full h-full object-cover"
              width={700}
              height={700}
            />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 h-full w-1/2 flex flex-col justify-center gap-1 ">
              <h3 className="text-primary-dark text-center text-lg md:text-[22px] font-medium md:font-semibold">
                {weeklyDetails?.description_one}
              </h3>
              <h3 className="text-primary-dark text-center text-lg md:text-[22px] font-medium md:font-semibold">
                {weeklyDetails?.description_two}
              </h3>
              <h3 className="text-primary-dark text-center text-lg md:text-[22px] font-medium md:font-semibold">
                {weeklyDetails?.description_three}
              </h3>
            </div>
          </div>
        </Cards>
      </div>
    </section>
  );
}

export default PregnancyDetails;

function Cards({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-t-10 border-t-primary min-h-[260px] rounded-lg bg-white text-xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
