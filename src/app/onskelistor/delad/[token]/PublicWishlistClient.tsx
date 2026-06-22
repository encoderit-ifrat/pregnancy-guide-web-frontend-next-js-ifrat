"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ExternalLink, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryPublicWishlist } from "../../_api/queries/useQueryWishlists";
import ClaimModal from "./_component/ClaimModal";
import { PublicWishlistItem } from "../../_types/wishlist_types";

export default function PublicWishlistClient() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const { data: wishlist, isLoading, isError } = useQueryPublicWishlist(token);

  const [claimItem, setClaimItem] = useState<PublicWishlistItem | null>(null);

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Heart className="size-4" /> {t("wishlists.public.heading")}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : isError || !wishlist ? (
          <Card className="mx-auto max-w-md p-10 text-center text-text-secondary">
            {t("wishlists.public.notFound")}
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden">
              <div className="relative h-56 w-full bg-primary-light">
                <Image
                  src={wishlist.cover_image || "/default_wishlist_image.png"}
                  alt={wishlist.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <h1 className="text-2xl font-bold">{wishlist.title}</h1>
                  {wishlist.description && (
                    <p className="text-sm opacity-90">{wishlist.description}</p>
                  )}
                </div>
              </div>
              {wishlist.reply_by && (
                <p className="px-6 py-3 text-sm text-text-secondary">
                  {t("wishlists.public.latestPurchase", {
                    date: new Date(wishlist.reply_by).toLocaleDateString("sv-SE"),
                  })}
                </p>
              )}
            </Card>

            <Card className="mt-6 overflow-x-auto p-0">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left text-text-secondary">
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.public.itemsName")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.public.price")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.public.pcs")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.public.claimStatus")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.public.productLink")}
                    </th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.items.map((item) => {
                    const claimed = item.claim_status === "claimed";
                    return (
                      <tr key={item._id} className="border-b last:border-0">
                        <td className="px-5 py-3 font-medium text-primary-dark">
                          {item.title}
                        </td>
                        <td className="px-5 py-3 text-text-secondary">
                          {item.price} {item.currency}
                        </td>
                        <td className="px-5 py-3 text-text-secondary">
                          {String(item.quantity).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-3">
                          {claimed ? (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                              {t("wishlists.public.claimed")}
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                              {t("wishlists.public.available")}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {item.product_url ? (
                            <a
                              href={item.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              {t("wishlists.public.viewProduct")}{" "}
                              <ExternalLink className="size-3.5" />
                            </a>
                          ) : (
                            <span className="text-text-secondary">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <Button
                            size="sm"
                            disabled={claimed}
                            onClick={() => setClaimItem(item)}
                          >
                            {claimed
                              ? t("wishlists.public.claimedBtn")
                              : t("wishlists.public.claimGift")}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>

      <ClaimModal
        token={token}
        item={claimItem}
        open={!!claimItem}
        onOpenChange={(v) => !v && setClaimItem(null)}
      />
    </PageContainer>
  );
}
