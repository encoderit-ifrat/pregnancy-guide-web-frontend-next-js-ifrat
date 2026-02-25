import React from "react";
import { calculatePregnancyProgress } from "@/utlis/calculateDate";
import { PregnancyDetailsProps } from "../_types/pregnancy_details_types";
import { useTranslation } from "@/hooks/useTranslation";

function PregnancyDetails({ userData, weeklyDetails }: PregnancyDetailsProps) {
  const { t } = useTranslation();
  const htmlString = weeklyDetails?.description;

  const updatedHtml = htmlString?.replace("$name", userData?.name);
  const pregnancyProgressInfo = calculatePregnancyProgress(
    userData?.details?.last_period_date || ""
  );

  return (
    <section className="w-full container-xl my-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6">
        <Cards>
          <h3 className="text-primary-dark text-lg md:text-[22px] font-semibold mb-2">
            {t(`pregnancy.trimesters.${pregnancyProgressInfo?.trimester?.match(/\d/)?.[0] || "1"}`)}
          </h3>
          <h3 className="text-lg md:text-[22px] mb-4">
            <span className="text-primary-dark font-medium md:font-semibold">
              {t("pregnancy.beenPregnant")}
            </span>
            <span className="font-normal ml-1">
              {pregnancyProgressInfo?.week} {t("pregnancy.weeks")} {pregnancyProgressInfo?.day}{" "} {t("pregnancy.days")}
            </span>
          </h3>
          <div className="text-lg md:text-[22px] mb-2">
            <span className="text-primary mr-2">
              {pregnancyProgressInfo?.percentage || 0}%
            </span>
            {t("pregnancy.completed")}
          </div>
          {/*slider*/}
          <div>
            <div className="w-full bg-gray-100 rounded-full h-4 mt-2">
              <div
                className="relative bg-primary h-4 rounded-full"
                style={{ width: `${pregnancyProgressInfo?.percentage || 0}%` }}
              >
                <div className="h-6 w-6 bg-white shadow-lg border border-black rounded-full absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </Cards>
        <Cards>
          {/* <h3 className="text-primary-dark text-lg md:text-[22px] font-medium md:font-semibold">
            Week-{pregnancyProgressInfo?.week} {userData.name}
          </h3> */}
          {weeklyDetails?.description && (
            <div
              className="no-tailwind"
              dangerouslySetInnerHTML={{ __html: updatedHtml }}
            />
          )}
        </Cards>
        <Cards>
          <div className="mb-2">
            <span className="text-primary-dark text-lg md:text-[22px] font-medium md:font-semibold">{t("pregnancy.dueDate")}</span>{" "}
            {pregnancyProgressInfo?.dueDate}
          </div>
          <div>
            <span className="text-primary-dark text-lg md:text-[22px] font-medium md:font-semibold">
              {t("pregnancy.daysRemaining")}
            </span>{" "}
            {pregnancyProgressInfo?.daysLeft} {t("pregnancy.days")}
          </div>
        </Cards>
      </div>
    </section>
  );
}

export default PregnancyDetails;


function Cards({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t-10 border-t-primary rounded-lg bg-white px-6 py-6 text-xl">
      {children}
    </div>
  );
}
