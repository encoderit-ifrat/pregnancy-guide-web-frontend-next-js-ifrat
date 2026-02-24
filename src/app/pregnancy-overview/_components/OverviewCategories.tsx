"use client";
import IconBaby from "@/assets/IconBaby";
import IconMother from "@/assets/IconMother";
import IconPartner from "@/assets/IconPartner";
import { CircleIcon } from "@/components/ui/CircleIcon";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import React from "react";
import { useTranslation } from "@/providers/I18nProvider";

const overviewCategories = [
  {
    id: 2,
    // icon: <IconBaby className="w-16 h-12 xl:w-26 xl:h-15" />,
    icon: <IconMother className="size-[108px] md:size-[180px] lg:size-[286px]" />,
    name: "Mother",
    // href: `/search-article?page=1&tag=mother`,
  },
  {
    id: 1,
    // icon: <IconBaby className="w-16 h-12 lg:w-26 lg:h-15" />,
    icon: <IconBaby className="size-[128px] md:size-[256px] lg:size-[380px]" />,
    name: "Baby",
    // href: `/search-article?page=1&tag=baby`,
  },
  {
    id: 3,
    // icon: <IconBaby className="w-16 h-12 xl:w-26 xl:h-15" />,
    icon: <IconPartner className="size-[108px] md:size-[180px] lg:size-[286px]" />,
    name: "Partner",
    // href: `/search-article?page=1&tag=partner`,
  },
];

function OverviewCategories() {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const currentPregnancyData = user?.details?.current_pregnancy_data;
  const week = currentPregnancyData?.week ?? 0;
  const day = currentPregnancyData?.day ?? 0;
  const currentWeek = day > 0 ? week + 1 : week;

  return (
    <section className="w-full pt-10 max-w-6xl mx-auto ">
      <div className="flex items-center justify-evenly  gap-2 text-foreground px-4 md:px-6">
        {overviewCategories.map((category) => {
          const { id, icon, name } = category;
          return (
            <Link
              key={id}
              href={`/search-article?page=1&tag=${category.name}&week=${currentWeek}`}
            >
              <div className="flex flex-col cursor-pointer">
                {icon}
                <p className="mt-4 text-center text-lg! md:text-3xl! text-primary-dark font-semibold">
                  {t(`pregnancy.categories.${name.toLowerCase()}`)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default OverviewCategories;
