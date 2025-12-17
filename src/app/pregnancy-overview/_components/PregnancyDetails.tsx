import PercentagePieChart from "@/components/chart/PieChart";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { calculatePregnancyProgress } from "@/utlis/calculateDate";
import { getPregnancyMessage } from "@/utlis/getPregnancyMessage";
import Image from "next/image";
import React from "react";
// const htmlString = '<p>asd as <p> <h1> dsa h1/> <p> ${name}</p>';
// const updatedHtml = htmlString.replace('${name}', currentUser);
// // Then render using dangerouslySetInnerHTML
{
  /* <div dangerouslySetInnerHTML={{ __html: updatedHtml }} /> */
}
function PregnancyDetails({ userData, weeklyDetails }: any) {
  const htmlString = weeklyDetails?.description;

  const updatedHtml = htmlString?.replace("$name", userData?.name);
  const pregnancyProgressInfo = calculatePregnancyProgress(
    userData?.details?.last_period_date
  );
  return (
    <section className="w-full  max-w-4xl my-10  mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
      <div className="flex-1 md:max-w-1/2 size-full shrink-0 text-center md:text-left popover-foreground pt-10 lg:pt-0 px-4">
        {weeklyDetails?.description && (
          // <div className="bg-red-500">
          <div
            className="no-tailwind"
            // className="truncate! whitespace-normal! text-wrap!"
            dangerouslySetInnerHTML={{ __html: updatedHtml }}
          />
          // </div>
        )}

        <Button variant="outline" size="lg" className="my-10">
          <span className="font-light">Due Date:</span>{" "}
          {pregnancyProgressInfo?.dueDate}
        </Button>
      </div>
      <div className=" overflow-hidden p-10 relative flex-1 size-full shrink-0 px-4">
        <Image
          src="/pregnant-woman.png"
          alt="pregnant-woman.png"
          fill
          // className="absolute z-10 size-full object-contain  left-0 top-0 translate-x-1/4"
          className="z-10 object-contain  left-0 top-0 translate-x-4/12 md:translate-x-3/12 scale-90"
        />
        <PercentagePieChart
          value={pregnancyProgressInfo?.percentage || 0}
          className={"size-full"}
        />

        <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-8xl lg:text-7xl">{`${Math.ceil(
            pregnancyProgressInfo?.percentage || 0
          )}%`}</p>
          <p className="capitalize font-semibold">completed</p>
          <p className="capitalize font-medium">
            {pregnancyProgressInfo?.trimester}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PregnancyDetails;
