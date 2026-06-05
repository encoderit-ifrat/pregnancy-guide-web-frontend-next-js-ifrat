"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useQueryBenefits } from "./_api/useQueryBenefits";
import { useSearchParams, useRouter } from "next/navigation";
import { Benefit } from "@/types/shared";
import Image from "next/image";
import Link from "next/link";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import Pagination from "@/components/base/Pagination";
import { PageContainer } from "@/components/layout/PageContainer";
import IconRightArrow from "@/components/svg-icon/icon-rightArrow";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function BenefitsClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewAllLimit, setViewAllLimit] = useState<number | null>(null);
  const [storedBenefits, setStoredBenefits] = useState<Benefit[]>([]);
  const [storedTotal, setStoredTotal] = useState(0);
  const currentLimit = viewAllLimit ?? 8;

  const { data, isLoading, isFetching } = useQueryBenefits({
    page: 1,
    limit: currentLimit,
  });

  useEffect(() => {
    if (data?.data?.data) {
      setStoredBenefits(data.data.data);
    }
    if (data?.data?.pagination?.total) {
      setStoredTotal(data.data.pagination.total);
    }
  }, [data]);

  const benefits = storedBenefits;
  const allItemsShown = benefits.length > 0 && benefits.length >= storedTotal;

  return (
    <PageContainer>
      <div className="">
        <div className="flex flex-col items-center justify-center mb-14">
          <IconHeading
            text={t("benefits.label")}
            image="/images/icons/baby-gift2.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("benefits.title")}
          </SectionHeading>
          <p className="max-w-lg text-center">{t("benefits.subtitle")}</p>
        </div>

        {isLoading && storedBenefits.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : benefits.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            {t("common.notFound")}
          </p>
        ) : (
          <>
            <div className="w-full bg-white rounded-2xl shadow-week-details lg:max-w-[1210px] mx-auto px-2 sm:px-5 lg:px-[60px] py-8 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
              {benefits.map((benefit) => (
                <div
                  key={benefit._id}
                  className="bg-white shadow-week-details p-2.5 rounded-[13px]"
                >
                  <div className="relative w-full h-[200px] lg:h-[300px] rounded-[8px] overflow-hidden">
                    <Link
                      href={`/formaner/${benefit.slug || "article-not-found"}`}
                    >
                      <Image
                        src={imageLinkGenerator(benefit.image) ?? ""}
                        alt={benefit.title}
                        width="1366"
                        height="580"
                        className="w-full h-full rounded-lg object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                        priority
                      />
                    </Link>
                    <div className="absolute bottom-0 left-0 right-0 bg-primary-dark/74 py-2 px-3 md:py-[14px] md:px-[18px] rounded-b-[8px]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[20px]! md:text-[25px]! font-medium md:font-semibold text-white line-clamp-1">
                          {benefit.title}
                        </h3>
                        <Link
                          href={`/formaner/${benefit.slug || "article-not-found"}`}
                        >
                          <IconRightArrow className="w-7 h-7! md:w-10! md:h-10! text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {benefits.length > 0 && (
                <div className="col-span-1 sm:col-span-2 flex items-center justify-center w-full">
                  <Button
                    onClick={() => setViewAllLimit(20)}
                    disabled={allItemsShown || (!!viewAllLimit && isFetching)}
                    className="py-2.5 px-3 md:px-5 rounded-full w-full max-w-[600px] bg-primary text-white flex items-center gap-2 mt-6"
                  >
                    {isFetching && viewAllLimit ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {t("benefits.viewAll")}
                        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* {pagination && (
              <Pagination
                meta={{
                  current_page: pagination.current_page,
                  last_page: pagination.last_page,
                  total: pagination.total,
                }}
                onClickPage={handlePageChange}
                onClickNext={handlePageChange}
                onClickPrev={handlePageChange}
              />
            )} */}
          </>
        )}
      </div>
    </PageContainer>
  );
}
