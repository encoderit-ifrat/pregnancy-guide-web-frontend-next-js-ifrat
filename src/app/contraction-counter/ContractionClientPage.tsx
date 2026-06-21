"use client";
import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";

type ContractionClientPageProps = object;

export default function ContractionClientPage({}: ContractionClientPageProps) {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div className="thread-header mb-8 flex flex-col items-center text-center">
        <IconHeading
          text={t("contraction.label")}
          image="/images/icons/wish-01.png"
          className="text-primary justify-center"
        />
        <SectionHeading className="my-2 mb-6">
          {t("contraction.title")}
        </SectionHeading>

        <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
          {t("contraction.subtitle")}
        </p>
      </div>
    </PageContainer>
  );
}
