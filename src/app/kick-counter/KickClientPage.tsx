"use client";
import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";

type KickClientPageProps = object;

export default function KickClientPage({}: KickClientPageProps) {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="thread-header mb-8 flex flex-col items-center text-center">
        <IconHeading
          text={t("kick.label")}
          image="/images/icons/wish-01.png"
          className="text-primary justify-center"
        />
        <SectionHeading className="my-2 mb-6">{t("kick.title")}</SectionHeading>

        <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
          {t("kick.subtitle")}
        </p>
      </div>
    </PageContainer>
  );
}
