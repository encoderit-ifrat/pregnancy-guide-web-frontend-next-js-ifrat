"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

import { useTranslation } from "@/hooks/useTranslation";

type InvitatioinsClientPageProps = object;

export default function InvitatioinsClientPage({}: InvitatioinsClientPageProps) {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div className="thread-header mb-8 flex flex-col items-center text-center">
        <IconHeading
          text={t("invitations.label")}
          image="/images/icons/inv-01.png"
          className="text-primary justify-center"
        />
        <SectionHeading className="my-2 mb-6">
          {t("invitations.title")}
        </SectionHeading>

        <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
          {t("invitations.subtitle")}
        </p>
      </div>

      <div className="w-full max-w-327 pb-20 mx-auto px-0 mt-8">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl px-2.5 sm:px-6 pt-6 pb-6 shadow-sm">
          <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
            {t("invitations.subtitle")}
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
