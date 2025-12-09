"use client";
import IconBaby from "@/assets/IconBaby";
import IconMother from "@/assets/IconMother";
import IconPartner from "@/assets/IconPartner";
import { CircleIcon } from "@/components/ui/CircleIcon";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import React from "react";

const overviewCategories = [
  {
    id: 1,
    // icon: <IconBaby className="w-16 h-12 lg:w-26 lg:h-15" />,
    icon: <IconBaby className="size-16 md:size-20 xl:size-28" />,
    name: "baby",
    // href: `/search-article?page=1&tag=baby`,
  },
  {
    id: 2,
    // icon: <IconBaby className="w-16 h-12 xl:w-26 xl:h-15" />,
    icon: <IconMother className="size-16 md:size-20 xl:size-28" />,
    name: "mother",
    // href: `/search-article?page=1&tag=mother`,
  },
  {
    id: 3,
    // icon: <IconBaby className="w-16 h-12 xl:w-26 xl:h-15" />,
    icon: <IconPartner className="size-16 md:size-20 xl:size-28" />,
    name: "partner",
    // href: `/search-article?page=1&tag=partner`,
  },
];

function OverviewCategories() {
  const { user } = useCurrentUser();
  const currentPregnancyData = user?.details?.current_pregnancy_data;
  const week = currentPregnancyData?.week ?? 0;
  const day = currentPregnancyData?.day ?? 0;
  const currentWeek = day > 0 ? week + 1 : week;

  return (
    <section className="w-full pt-25  lg:pt-44 max-w-4xl mx-auto ">
      <div className="flex  items-center justify-evenly  gap-2 text-foreground px-4 md:px-6">
        {overviewCategories.map((category) => {
          const { id, icon, name } = category;
          return (
            <Link
              key={id}
              href={`/search-article?page=1&tag=${category.name}&week=${currentWeek}`}
            >
              <div className="flex flex-col cursor-pointer">
                <CircleIcon
                  bgClass="bg-circle-alt"
                  className="mb-4 size-24 md:size-32 xl:size-36"
                >
                  {icon}
                </CircleIcon>
                <p className="text-center text-xl md:text-2xl xl:text-3xl uppercase">
                  {name}
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
