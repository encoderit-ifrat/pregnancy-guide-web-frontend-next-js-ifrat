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
import { Slider } from "@/components/ui/Slider";
import { SwiperSlide } from "swiper/react";
import { useQueryInvitations } from "./_api/queries/useQueryInvitations";

type InvitatioinsClientPageProps = object;

function SkeletonInvitationCard() {
  return (
    <div className="w-full max-w-[316px] md:max-w-[348px] mx-auto min-h-[483px] bg-white border border-[#F3E8FF] rounded-[15px] p-[5px] shadow-week-details flex flex-col animate-pulse">
      <div className="w-full h-[176px] rounded-[10px] bg-primary/10 shrink-0" />
      <div className="py-[15px] px-2 flex flex-col flex-1">
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-primary/10" />
          <div className="h-4 w-1/2 rounded bg-primary/10" />
        </div>
        <div className="mt-[15px] space-y-2">
          <div className="h-4 w-2/3 rounded bg-primary/10" />
          <div className="h-4 w-3/4 rounded bg-primary/10" />
          <div className="h-4 w-1/3 rounded bg-primary/10" />
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <div className="flex-1 h-10 rounded-full bg-primary/10" />
          <div className="w-12 h-12 rounded-full bg-primary/10" />
        </div>
      </div>
    </div>
  );
}

export default function InvitatioinsClientPage({}: InvitatioinsClientPageProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { data, isLoading } = useQueryInvitations(activeTab);

  const invitations = data?.data ?? [];
  // console.log("invitations", invitations);

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '"></span>';
    },
  };

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
        <Link
          href="/inbjudningar/skapa"
          className="lg:hidden font-semibold text-lg bg-primary text-white w-full py-2.5 rounded-full shadow-invitation-box inline-flex items-center justify-center gap-2"
        >
          {t("invitations.createInvitation")}
          <PlusIcon className="bg-white text-primary p-0.5 rounded-full w-6 h-6" />
        </Link>
      </div>

      <div className="w-full max-w-327 pb-20 mx-auto px-0 mt-8">
        <div className="bg-transparent md:bg-white border-0 md:border border-[#E5E7EB] rounded-2xl px-2.5 lg:px-6 pt-6 pb-6 shadow-none md:shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full lg:px-0 xl:px-[66px] lg:py-[65px]"
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
                className="hidden font-semibold text-lg text-primary px-4 py-2.5 rounded-full shadow-invitation-box lg:inline-flex items-center gap-2"
              >
                {t("invitations.createInvitation")}
                <PlusIcon className="bg-primary text-white p-2 rounded-full w-9 h-9" />
              </Link>
            </div>
            <TabsContent
              value="all"
              className="m-0 bg-white md:bg-transparent py-[25px] px-2.5 md:p-0 rounded-[16px] shadow-invitation-box md:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={i}>
                          <SkeletonInvitationCard />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonInvitationCard key={i} />
                    ))}
                  </div>
                </>
              ) : invitations.length > 0 ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {invitations.map((inv) => (
                        <SwiperSlide key={inv._id}>
                          <InvitationCard inv={inv} />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv) => (
                      <InvitationCard key={inv._id} inv={inv} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[373px] w-full flex flex-col items-center justify-center">
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
              value="draft"
              className="m-0 bg-white md:bg-transparent py-[25px] px-2.5 md:p-0 rounded-[16px] shadow-invitation-box md:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={i}>
                          <SkeletonInvitationCard />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonInvitationCard key={i} />
                    ))}
                  </div>
                </>
              ) : invitations.length > 0 ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {invitations.map((inv) => (
                        <SwiperSlide key={inv._id}>
                          <InvitationCard inv={inv} />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv) => (
                      <InvitationCard key={inv._id} inv={inv} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[373px] w-full flex flex-col items-center justify-center">
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
              value="sent"
              className="m-0 bg-white md:bg-transparent py-[25px] px-2.5 md:p-0 rounded-[16px] shadow-invitation-box md:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={i}>
                          <SkeletonInvitationCard />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonInvitationCard key={i} />
                    ))}
                  </div>
                </>
              ) : invitations.length > 0 ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {invitations.map((inv) => (
                        <SwiperSlide key={inv._id}>
                          <InvitationCard inv={inv} />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv) => (
                      <InvitationCard key={inv._id} inv={inv} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[373px] w-full flex flex-col items-center justify-center">
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
              className="m-0 bg-white md:bg-transparent py-[25px] px-2.5 md:p-0 rounded-[16px] shadow-invitation-box md:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={i}>
                          <SkeletonInvitationCard />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonInvitationCard key={i} />
                    ))}
                  </div>
                </>
              ) : invitations.length > 0 ? (
                <>
                  <div className="md:hidden">
                    <Slider
                      options={{
                        spaceBetween: 14,
                        slidesPerView: 1.2,
                        pagination: pagination,
                      }}
                      sideOverlayClassName="bg-transparent"
                      className="px-0! pb-12!"
                    >
                      {invitations.map((inv) => (
                        <SwiperSlide key={inv._id}>
                          <InvitationCard inv={inv} />
                        </SwiperSlide>
                      ))}
                    </Slider>
                  </div>
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv) => (
                      <InvitationCard key={inv._id} inv={inv} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[373px] w-full flex flex-col items-center justify-center">
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
