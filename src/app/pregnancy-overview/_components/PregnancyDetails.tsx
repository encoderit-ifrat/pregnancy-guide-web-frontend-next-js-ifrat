import React from "react";
import { calculatePregnancyProgress } from "@/utlis/calculateDate";
import { PregnancyDetailsProps } from "../_types/pregnancy_details_types";

function PregnancyDetails({ userData, weeklyDetails }: PregnancyDetailsProps) {
  const htmlString = weeklyDetails?.description;

  const updatedHtml = htmlString?.replace("$name", userData?.name);
  const pregnancyProgressInfo = calculatePregnancyProgress(
    userData?.details?.last_period_date
  );

  return (
    <section className="w-full max-w-7xl p-2 mx-auto my-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6">
        {/*card*/}
        <div className="border-t-10 border-t-primary rounded-lg bg-white px-6 py-4">
          <h3 className="text-primary-dark text-xl font-semibold mb-2">
            {pregnancyProgressInfo?.trimester}
          </h3>
          <h3 className="text-xl mb-4">
            <span className="text-primary-dark font-semibold">
              Been pregnant:
            </span>
            <span>
              {pregnancyProgressInfo?.week} weeks {pregnancyProgressInfo?.day}{" "}
              days
            </span>
          </h3>
          <div className="text-xl">
            <span className="text-primary">
              {pregnancyProgressInfo?.percentage || 0}%
            </span>
            Completed
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
        </div>
        {/*card*/}
        <div className="border-t-10 border-t-primary rounded-lg bg-white px-6 py-4">
          <h3 className="text-primary-dark  text-xl font-semibold">
            Week-{pregnancyProgressInfo?.week} {userData.name}
          </h3>
          {weeklyDetails?.description && (
            <div
              className="no-tailwind"
              dangerouslySetInnerHTML={{ __html: updatedHtml }}
            />
          )}
        </div>
        {/*card*/}
        <div className="border-t-10 border-t-primary rounded-lg bg-white px-6 py-4 text-xl">
          <h3 className="mb-2">
            <span className="text-primary-dark font-semibold">Due Date:</span>{" "}
            {pregnancyProgressInfo?.dueDate}
          </h3>
          <h3>
            <span className="text-primary-dark font-semibold">
              Days remaining to birth:
            </span>{" "}
            {pregnancyProgressInfo?.daysLeft} days
          </h3>
        </div>
      </div>
    </section>
  );
}

export default PregnancyDetails;
