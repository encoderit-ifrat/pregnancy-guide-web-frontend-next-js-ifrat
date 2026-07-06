"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Heart, Mail, Plus, Share2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryWishlists } from "./_api/queries/useQueryWishlists";
import CreateWishlistModal from "./_component/CreateWishlistModal";
import { WishlistListItem } from "./_types/wishlist_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { Slider } from "@/components/ui/Slider";
import { SwiperSlide } from "swiper/react";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { toast } from "sonner";
import Pagination from "@/components/base/Pagination";

export default function WishlistsClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQueryWishlists(page);

  const wishlists = data?.data ?? [];

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <div className="thread-header mb-8 flex flex-col items-center text-center">
          <IconHeading
            text={t("wishlists.badge")}
            image="/images/icons/wish-01.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 mb-6">
            {t("wishlists.title")}
          </SectionHeading>

          <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
            {t("wishlists.subtitle")}
          </p>
          {isAuthenticated && (
            <Button
              onClick={() => setCreateOpen(true)}
              className="md:hidden bg-primary w-full"
            >
              {t("wishlists.createWishlist")}{" "}
              <Plus className="size-4 bg-white text-primary rounded-full p-1 w-6 h-6" />
            </Button>
          )}
        </div>

        <Card className="px-[9px] py-[25px] lg:px-[35px] xl:px-[66px] lg:py-[63px] shadow-week-details border-none rounded-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary-dark">
              {t("wishlists.yourWishlists")}
            </h2>
            {isAuthenticated && (
              <Button
                onClick={() => setCreateOpen(true)}
                className="hidden md:flex"
              >
                {t("wishlists.createWishlist")} <Plus className="size-4" />
              </Button>
            )}
          </div>

          {userLoading || isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : !isAuthenticated ? (
            <EmptyState
              title={t("wishlists.loginTitle")}
              desc={t("wishlists.loginDesc")}
              action={
                <Button asChild className="mt-4">
                  <Link href="/logga-in">{t("wishlists.login")}</Link>
                </Button>
              }
            />
          ) : wishlists.length === 0 ? (
            <EmptyState
              title={t("wishlists.noWishlistsTitle")}
              desc={t("wishlists.noWishlistsDesc")}
            />
          ) : (
            <>
              <div className="md:hidden">
                <Slider
                  options={{
                    spaceBetween: 15,
                    slidesPerView: 1,
                    pagination: pagination,
                  }}
                  sideOverlayClassName="bg-transparent"
                  className="px-0! pb-12!"
                >
                  {wishlists.map((w) => (
                    <SwiperSlide key={w._id}>
                      <WishlistCard wishlist={w} />
                    </SwiperSlide>
                  ))}
                </Slider>
              </div>
              <div className="hidden md:grid gap-6 md:grid-cols-2">
                {wishlists.map((w) => (
                  <WishlistCard key={w._id} wishlist={w} />
                ))}
              </div>
              <Pagination
                currentPage={data?.pagination?.current_page ?? 1}
                totalPages={data?.pagination?.last_page ?? 1}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>
      </div>

      <CreateWishlistModal open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}

function WishlistCard({ wishlist }: { wishlist: WishlistListItem }) {
  const { t } = useTranslation();
  const { progress } = wishlist;
  const handleShare = (token: string | null) => {
    if (!token) return;
    const url = `${window.location.origin}/onskelistor/delad/${token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success(t("wishlists.detail.linkCopied")),
      () => toast.error(t("wishlists.detail.copyFailed"))
    );
  };
  return (
    <Card className="overflow-hidden p-1.5 border border-[#F3E8FF] shadow-none rounded-[15px]! flex flex-col h-[370px] md:h-full">
      <div className="relative h-[152px] md:h-[255px] w-full bg-primary-light rounded-[10px] overflow-hidden">
        <Image
          src={
            imageLinkGenerator(wishlist.cover_image) || "/images/default.png"
          }
          alt={wishlist.title}
          fill
          className="w-full h-full object-cover"
        />
      </div>
      <div className="py-[14px] px-2 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-primary-dark line-clamp-1">
          {wishlist.title}
        </h3>
        {wishlist.description && (
          <p className="mt-1 mb-5 text-sm text-text-secondary line-clamp-1">
            {wishlist.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="mb-[14px] px-3 py-1.5 rounded-[10px] bg-[#F8F7FC]">
            <div className="mb-2 flex justify-between">
              <span className="text-primary-dark font-medium text-xs">
                {t("wishlists.progress")}
              </span>
              <span className="font-medium text-xs text-primary">
                {t("wishlists.itemsClaimed", {
                  claimed: progress.claimed,
                  total: progress.total,
                })}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center w-full gap-2">
            <Link
              href={`/onskelistor/${wishlist._id}`}
              className="flex-1 font-semibold bg-[#F6F0FB] border border-primary text-lg text-primary px-4 py-2.5 rounded-full shadow-invitation-box inline-flex items-center justify-center gap-2"
            >
              {t("wishlists.viewDetails")}
            </Link>
            <Button
              variant="outline"
              onClick={() =>
                handleShare(wishlist.share_token ? wishlist.share_token : null)
              }
              className="bg-primary-light2 p-0 overflow-hidden justify-center"
            >
              <div className="rounded-full bg-[#FAF5FF] w-12 h-12 flex justify-center items-center">
                <Share2 className="w-6 h-6 text-primary " />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary-light">
        <Mail className="size-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-primary-dark">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{desc}</p>
      {action}
    </div>
  );
}
