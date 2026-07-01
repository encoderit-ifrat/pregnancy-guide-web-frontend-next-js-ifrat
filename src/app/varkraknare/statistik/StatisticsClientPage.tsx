"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import ContractionStatistics from "../_component/ContractionStatistics";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { ArrowLeft } from "lucide-react";

export default function StatisticsClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <Link
          href={"/varkraknare"}
          className="flex items-center gap-2 mb-[35px] md:my-[35px]"
        >
          <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
          <p className="text-base font-normal">
            {t("contractionCounter.stats.back")}
          </p>
        </Link>

        {userLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !isAuthenticated ? (
          <Card className="mx-auto max-w-md p-8 text-center">
            <p className="text-primary-dark">
              {t("contractionCounter.loginPrompt")}
            </p>
            <Button asChild className="mt-4">
              <Link href="/logga-in">{t("contractionCounter.login")}</Link>
            </Button>
          </Card>
        ) : (
          <ContractionStatistics />
        )}
      </div>
    </PageContainer>
  );
}
