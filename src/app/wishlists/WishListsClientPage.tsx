"use client";
import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";

type WishListsClientPageProps = object;

export default function WishListsClientPage({}: WishListsClientPageProps) {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <div className="thread-header mb-8 flex flex-col items-center text-center">
        <IconHeading
          text={t("wishlists.label")}
          image="/images/icons/wish-01.png"
          className="text-primary justify-center"
        />
        <SectionHeading className="my-2 mb-6">
          {t("wishlists.title")}
        </SectionHeading>

        <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
          {t("invitations.subtitle")}
        </p>
      </div>
    </PageContainer>
  );
}
