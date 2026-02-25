// "use client";
// import IconBaby from "@/assets/IconBaby";
// import IconMother from "@/assets/IconMother";
// import IconPaper from "@/assets/IconPaper";
// import IconPartner from "@/assets/IconPartner";
// import { CircleIcon } from "@/components/ui/CircleIcon";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import Link from "next/link";
// import React from "react";

// const overviewCategories = [
//   {
//     id: 2,
//     // icon: <IconBaby className="w-16 h-12 xl:w-26 xl:h-15" />,
//     icon: <IconMother className="md:size-48 lg:size-78 xl:size-92 transform scale-[0.8]" />,
//     // icon: <IconMother className="size-[108px] md:size-[180px] lg:size-[286px]" />,
//     name: "Mother",
//     // href: `/search-article?page=1&tag=mother`,
//   },
//   {
//     id: 1,
//     // icon: <IconBaby className="w-16 h-12 lg:w-26 lg:h-15" />,
//     icon: <IconBaby className="md:size-48 lg:size-78 xl:size-92" />,
//     // icon: <IconBaby className="size-[128px] md:size-[256px] lg:size-[380px]" />,
//     name: "Baby",
//     // href: `/search-article?page=1&tag=baby`,
//   },
//   {
//     id: 3,
//     // icon: <IconBaby className="w-16 h-12 xl:w-26 xl:h-15" />,
//     icon: <IconMother className="md:size-48 lg:size-78 xl:size-92  transform scale-[0.8]" />,
//     // icon: <IconPartner className="size-[108px] md:size-[180px] lg:size-[286px]" />,
//     name: "Partner",
//     // href: `/search-article?page=1&tag=partner`,
//   },
// ];

// function OverviewCategories() {
//   const { user } = useCurrentUser();
//   const currentPregnancyData = user?.details?.current_pregnancy_data;
//   const week = currentPregnancyData?.week ?? 0;
//   const day = currentPregnancyData?.day ?? 0;
//   const currentWeek = day > 0 ? week + 1 : week;

//   return (
//     <section className="w-full pt-10 max-w-6xl mx-auto ">
//       <div className="flex items-center justify-evenly  gap-2 text-foreground px-4 md:px-6">
//         {overviewCategories.map((category) => {
//           const { id, icon, name } = category;
//           return (
//             <Link
//               key={id}
//               href={`/search-article?page=1&tag=${category.name}&week=${currentWeek}`}
//             >
//               <div className="flex flex-col cursor-pointer">
//                 <div className="relative">
//                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                     <IconPaper />
//                   </div>
//                   <div className="relative border-2 border-primary-dark">
//                     {icon}
//                   </div>
//                 </div>
//                 <p className="mt-4 text-center text-lg! md:text-3xl! text-primary-dark font-semibold">
//                   {name}
//                 </p>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// export default OverviewCategories;

"use client";
import IconBaby from "@/assets/IconBaby";
import IconMother from "@/assets/IconMother";
import IconPaper from "@/assets/IconPaper";
import IconPartner from "@/assets/IconPartner";
import { CircleIcon } from "@/components/ui/CircleIcon";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import React from "react";

const overviewCategories = [
  {
    id: 2,
    icon: <IconMother className="w-full h-full" />,
    name: "Mother",
    label: "pregnancy.mother",
  },
  {
    id: 1,
    icon: <IconBaby className="w-full h-full" />,
    name: "Baby",
    label: "pregnancy.baby",
  },
  {
    id: 3,
    icon: <IconPartner className="w-full h-full" />,
    name: "Partner",
    label: "pregnancy.partner",
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
    <section className="w-full pt-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-center gap-2 sm:gap-8 md:gap-12 lg:gap-16 text-foreground px-4 md:px-6">
        {overviewCategories.map((category) => {
          const { id, icon, name, label } = category;
          const isBaby = name === "Baby";

          return (
            <Link
              key={id}
              href={`/search-article?page=1&tag=${category.name}&week=${currentWeek}`}
              className="group"
            >
              <div className="flex flex-col items-center cursor-pointer">
                {/* Icon Container */}
                <div className="relative">
                  <div
                    className={`
                    relative rounded-full border-6 border-primary-light
                    flex items-center justify-center
                    ${isBaby
                        ? 'w-32 h-32 md:w-56 md:h-56 lg:w-68 lg:h-68'
                        : 'w-28 h-28 md:w-36 md:h-36 lg:w-56 lg:h-56'}
                    transition-all group-hover:border-primary-light/80
                  `}
                  >
                    {icon}

                    <div
                      className="
    absolute -top-2 -right-2 z-20
    group-hover:top-1/2 
    group-hover:left-1/2
    group-hover:right-auto
    group-hover:-translate-x-1/2
    group-hover:-translate-y-1/2
    rounded-full
    group-hover:bg-primary-dark/40
    group-hover:p-3
    group-hover:size-42
    transition-all duration-300 ease-in-out
  "
                    >
                      <div className="flex flex-col items-center justify-center
    rounded-full      
    group-hover:bg-primary-dark
    group-hover:p-6
    group-hover:size-full
    ">
                        <IconPaper className="w-12 h-12 md:group-hover:w-12 md:group-hover:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                        <p className="hidden group-hover:block text-white! text-center text-xs pt-1 text-wrap">{t("pregnancy.readArticle")}</p>
                      </div>
                    </div>

                    {/* Paper Overlay */}
                    {/* <div className="absolute inset-0 flex items-center justify-center
                    opacity-0 scale-75
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:scale-100
                    z-20">
                      <IconPaper className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28" />
                    </div> */}
                  </div>
                </div>

                {/* Label */}
                <p className="mt-4 text-center text-lg! md:text-3xl! text-primary-dark font-semibold">
                  {t(label)}
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