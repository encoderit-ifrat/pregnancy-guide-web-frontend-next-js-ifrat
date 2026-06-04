"use client";

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

export default function BenefitsPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  const { data, isLoading } = useQueryBenefits({ page, limit });

  const benefits: Benefit[] = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const handlePageChange = (newPage: number) => {
    router.push(`/f%C3%B6rm%C3%A5ner?page=${newPage}`);
  };

  return (
    <div className="min-h-svh bg-white">
      <div className="px-4 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-14">
          <IconHeading
            text={t("benefits.label")}
            image="/images/icons/gift.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("benefits.title")}
          </SectionHeading>
          <p className="max-w-lg text-center">{t("benefits.subtitle")}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : benefits.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            {t("common.notFound")}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <Link
                  key={benefit._id}
                  href={`/f%C3%B6rm%C3%A5ner/${benefit.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {benefit.image && (
                    <div className="relative w-full h-52 overflow-hidden">
                      <Image
                        src={imageLinkGenerator(benefit.image) ?? ""}
                        alt={benefit.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-primary-dark group-hover:text-primary transition-colors line-clamp-2">
                      {benefit.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
