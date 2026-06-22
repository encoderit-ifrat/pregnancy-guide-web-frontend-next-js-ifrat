"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Heart, Mail, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryWishlists } from "./_api/queries/useQueryWishlists";
import CreateWishlistModal from "./_component/CreateWishlistModal";
import { WishlistListItem } from "./_types/wishlist_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

export default function WishlistsClientPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: userLoading } = useCurrentUser();
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading } = useQueryWishlists();

  const wishlists = data?.data ?? [];

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
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary-dark">
              {t("wishlists.yourWishlists")}
            </h2>
            {isAuthenticated && (
              <Button onClick={() => setCreateOpen(true)}>
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
            <div className="grid gap-6 md:grid-cols-2">
              {wishlists.map((w) => (
                <WishlistCard key={w._id} wishlist={w} />
              ))}
            </div>
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
  return (
    <Card className="overflow-hidden">
      <div className="relative h-44 w-full bg-primary-light">
        <Image
          src={wishlist.cover_image || "/default_wishlist_image.png"}
          alt={wishlist.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-primary-dark">
          {wishlist.title}
        </h3>
        {wishlist.description && (
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
            {wishlist.description}
          </p>
        )}

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-text-secondary">
              {t("wishlists.progress")}
            </span>
            <span className="font-medium text-primary">
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

        <Button
          asChild
          variant="outline"
          className="mt-4 w-full justify-center"
        >
          <Link href={`/onskelistor/${wishlist._id}`}>
            {t("wishlists.viewDetails")}
          </Link>
        </Button>
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
