"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { useBabyCreate, babyRequestType } from "@/app/min-profil/_api/mutations/useBabyCreate";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { calculateDueDateFromLPD } from "@/utlis/calculateDate";

function NoPregnancyInfo() {
  const { t } = useTranslation();
  const router = useRouter();
  const { refetch } = useCurrentUser();
  const { mutate: babyCreate, isPending } = useBabyCreate();

  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>();

  const handleLastPeriodChange = (date: Date | undefined) => {
    setLastPeriodDate(date);
    if (date && !dueDate) {
      const calculatedDueDate = calculateDueDateFromLPD(date.toISOString());
      setDueDate(new Date(calculatedDueDate));
    }
  };

  const handleSubmit = () => {
    if (!dueDate && !lastPeriodDate) return;
    const values: babyRequestType = {
      due_date: dueDate?.toISOString(),
      last_period_date: lastPeriodDate?.toISOString(),
      upcoming: true,
    };
    babyCreate(values, {
      onSuccess: () => {
        toast.success(t("profile.updateSuccess"));
        refetch();
        router.refresh();
        router.push("/min-profil");
      },
      onError: () => {
        toast.error(t("profile.updateFailed"));
      },
    });
  };

  return (
    <div className="bg-primary-light">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          {/* Icon/Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-linear-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <h2 className="text-2xl font-bold mb-3 bg-primary bg-clip-text text-transparent">
              {t("pregnancy.startJourney")}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("pregnancy.noInfoDesc")}
            </p>

            <div className="flex flex-col gap-3 text-left">
              <div>
                {dueDate && (
                  <p className="text-xs text-text-mid mb-1">
                    {t("formProfile.dueDatePlaceholder")}
                  </p>
                )}
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 pointer-events-none">
                    <Calendar className="w-5 h-5 text-text-mid" />
                  </div>
                  <div className="[&_button]:rounded-full [&_button]:pl-12 [&_button]:w-full [&_button]:justify-start [&_button]:font-normal [&_button]:text-text-mid [&_button]:!bg-white [&_button]:!border [&_button]:!border-input [&_button]:border-solid [&_button]:hover:!bg-white [&_button>svg]:hidden">
                    <DatePicker
                      key={String(dueDate?.getTime() ?? "due-empty")}
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder={t("formProfile.dueDatePlaceholder")}
                    />
                  </div>
                </div>
              </div>
              <div>
                {lastPeriodDate && (
                  <p className="text-xs text-text-mid mb-1">
                    {t("formProfile.lastPeriodPlaceholder")}
                  </p>
                )}
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 pointer-events-none">
                    <Calendar className="w-5 h-5 text-text-mid" />
                  </div>
                  <div className="[&_button]:rounded-full [&_button]:pl-12 [&_button]:w-full [&_button]:justify-start [&_button]:font-normal [&_button]:text-text-mid [&_button]:!bg-white [&_button]:!border [&_button]:!border-input [&_button]:border-solid [&_button]:hover:!bg-white [&_button>svg]:hidden">
                    <DatePicker
                      key={String(lastPeriodDate?.getTime() ?? "lpd-empty")}
                      value={lastPeriodDate}
                      onChange={handleLastPeriodChange}
                      placeholder={t("formProfile.lastPeriodPlaceholder")}
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                isLoading={isPending}
                disabled={isPending || (!dueDate && !lastPeriodDate)}
                className="w-full mt-2"
                size="lg"
              >
                {t("formProfile.saveProfile")}
              </Button>
            </div>

            {/* Decorative dots */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            </div>
          </div>

          {/* Helper text */}
          <p className="mt-6 text-sm text-gray-500">
            {t("pregnancy.privacySecure")}
          </p>
        </div>
      </div>
      {/* <section>
        <Image
          src="/assets/logo/waveThird.svg"
          alt="Wave"
          width={1920}
          height={239}
          className="object-cover w-full h-auto"
          priority
        />
      </section> */}
    </div>
  );
}

export default NoPregnancyInfo;
