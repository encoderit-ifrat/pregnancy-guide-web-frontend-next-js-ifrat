"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/PageContainer";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import InvitationCard from "./_component/InvitationCard";
import { useQueryInvitations } from "./_api/queries/useQueryInvitations";

type InvitatioinsClientPageProps = object;

export default function InvitatioinsClientPage({}: InvitatioinsClientPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { data, isLoading } = useQueryInvitations(activeTab);

  const invitations = data?.data ?? [];
  // console.log("invitations", invitations);

  return (
    <PageContainer>
      <div className="thread-header mb-8 flex flex-col items-center text-center">
        <IconHeading
          text={t("invitations.badge")}
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
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full lg:px-[66px] lg:py-[65px]"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-3 pb-4 mb-4">
              <TabsList
                variant="default"
                className="bg-white shadow-invitation-box rounded-[10px] px-2 py-[7px] text-primary-color"
              >
                <TabsTrigger value="all" className="" variant="inv">
                  {t("invitations.all")}
                </TabsTrigger>
                <TabsTrigger value="draft" variant="inv">
                  {t("invitations.draft")}
                </TabsTrigger>
                <TabsTrigger value="sent" variant="inv">
                  {t("invitations.sent")}
                </TabsTrigger>
                <TabsTrigger value="scheduled" variant="inv">
                  {t("invitations.scheduled")}
                </TabsTrigger>
              </TabsList>
              <Link
                href="/inbjudningar/skapa"
                className="font-semibold text-lg text-primary px-4 py-2.5 rounded-full shadow-invitation-box inline-flex items-center gap-2"
              >
                {t("invitations.createInvitation")}
                <PlusIcon className="bg-primary text-white p-2 rounded-full w-9 h-9" />
              </Link>
            </div>
            <TabsContent value="all" className="m-0 grid grid-cols-3 gap-6">
              {/* {namesLoading && (
                  <>
                    <SkeletonCommunityCard />
                    <SkeletonCommunityCard />
                    <SkeletonCommunityCard />
                  </>
                )} */}
              {/* {namesError && (
                  <p className="text-center text-red-500 py-4">
                    {t("forNameTinder.failedLoadNames")}
                  </p>
                )}
                {!namesLoading &&
                  !namesError &&
                  communityNames.length === 0 && (
                    <p className="text-center text-primary-color py-4">
                      {t("forNameTinder.noNamesFound")}
                    </p>
                  )} */}
              {invitations.length > 0 ? (
                invitations.map((inv) => (
                  <InvitationCard key={inv._id} inv={inv} />
                ))
              ) : (
                <div className="h-[373px] col-span-3 w-full flex flex-col items-center justify-center">
                  <Image
                    src={"/images/icons/no-inv.png"}
                    width={700}
                    height={700}
                    className="w-20 h-20"
                    alt={t("invitations.all")}
                  />
                  <p className="text-[25px]! font-semibold mt-6 mb-3">
                    {t("invitations.noInvitationsTitle")}
                  </p>
                  <p className="text-base font-normal">
                    {t("invitations.noInvitationsDesc")}
                  </p>
                </div>
              )}

              {/* <Pagination
                  meta={paginationMeta}
                  onPageChange={handlePageChange}
                /> */}
            </TabsContent>
            <TabsContent value="draft" className="m-0 grid grid-cols-3 gap-6">
              {invitations.length > 0 ? (
                invitations.map((inv) => (
                  <InvitationCard key={inv._id} inv={inv} />
                ))
              ) : (
                <div className="h-[373px] col-span-3 w-full flex flex-col items-center justify-center">
                  <Image
                    src={"/images/icons/no-inv.png"}
                    width={700}
                    height={700}
                    className="w-20 h-20"
                    alt={t("invitations.all")}
                  />
                  <p className="text-[25px]! font-semibold mt-6 mb-3">
                    {t("invitations.noInvitationsTitle")}
                  </p>
                  <p className="text-base font-normal">
                    {t("invitations.noInvitationsDesc")}
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="sent" className="m-0 grid grid-cols-3 gap-6">
              {invitations.length > 0 ? (
                invitations.map((inv) => (
                  <InvitationCard key={inv._id} inv={inv} />
                ))
              ) : (
                <div className="h-[373px] col-span-3 w-full flex flex-col items-center justify-center">
                  <Image
                    src={"/images/icons/no-inv.png"}
                    width={700}
                    height={700}
                    className="w-20 h-20"
                    alt={t("invitations.all")}
                  />
                  <p className="text-[25px]! font-semibold mt-6 mb-3">
                    {t("invitations.noInvitationsTitle")}
                  </p>
                  <p className="text-base font-normal">
                    {t("invitations.noInvitationsDesc")}
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="scheduled"
              className="m-0 grid grid-cols-3 gap-6"
            >
              {invitations.length > 0 ? (
                invitations.map((inv) => (
                  <InvitationCard key={inv._id} inv={inv} />
                ))
              ) : (
                <div className="h-[373px] col-span-3 w-full flex flex-col items-center justify-center">
                  <Image
                    src={"/images/icons/no-inv.png"}
                    width={700}
                    height={700}
                    className="w-20 h-20"
                    alt={t("invitations.all")}
                  />
                  <p className="text-[25px]! font-semibold mt-6 mb-3">
                    {t("invitations.noInvitationsTitle")}
                  </p>
                  <p className="text-base font-normal">
                    {t("invitations.noInvitationsDesc")}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
