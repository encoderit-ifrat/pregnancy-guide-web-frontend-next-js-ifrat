"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ExternalLink, Heart, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryPublicWishlist } from "../../_api/queries/useQueryWishlists";
import ClaimModal from "./_component/ClaimModal";
import { PublicWishlistItem } from "../../_types/wishlist_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";

export default function PublicWishlistClient() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const { data: wishlist, isLoading, isError } = useQueryPublicWishlist(token);

  const [claimItem, setClaimItem] = useState<PublicWishlistItem | null>(null);

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl">
        <div className="thread-header mb-8 flex flex-col items-center text-center">
          <IconHeading
            text={t("wishlists.badge")}
            image="/images/icons/wish-01.png"
            className="text-primary justify-center"
          />
          <SectionHeading className="my-2 md:my-0 mb-6 md:mb-[15px]!">
            {t("wishlists.title")}
          </SectionHeading>

          <p className="text-sm text-primary-color text-center mb-4 max-w-3xl mx-auto">
            {t("wishlists.subtitle")}
          </p>
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
            <Card className="overflow-hidden px-2.5 py-3 lg:p-[17px] border border-[#F3E8FF] rounded-[8px]!">
              <div className="relative overflow-hidden h-44 md:h-[483px] w-full rounded-[10px]! bg-primary-light">
                <Image
                  src={
                    imageLinkGenerator(wishlist.cover_image) ||
                    "/default_wishlist_image.png"
                  }
                  alt={wishlist.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-1.5 md:py-[18px] md:px-6 w-full flex flex-col justify-end">
                  <div className="w-full md:max-w-[468px] bg-[#3D3177A1] rounded-[10px]! text-white px-2.5 py-1 md:py-[14px] md:px-5">
                    <h1 className="text-xl! font-semibold! mb-0! truncate">
                      {wishlist.title}
                    </h1>
                    {wishlist.description && (
                      <p className="text-base! font-normal! text-white! truncate">
                        {wishlist.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* {wishlist.reply_by && (
                <p className="px-6 py-3 text-sm text-text-secondary">
                  {t("wishlists.public.latestPurchase", {
                    date: new Date(wishlist.reply_by).toLocaleDateString(
                      "sv-SE"
                    ),
                  })}
                </p>
              )} */}
            </Card>

            <Card className="mt-6 overflow-x-auto py-[25px] px-2.5">
              <table className="hidden md:table w-full min-w-[720px] text-sm">
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
              <div className="md:hidden space-y-4">
                {wishlist.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 border border-[#F3E8FF] rounded-[15px] py-[11px] px-[13px]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-primary-dark!">
                          {item.title}
                        </h3>
                      </div>
                      <div
                        onClick={() => setClaimItem(item)}
                        className="size-8 hover:bg-primary/10 border border-primary rounded-[5px] flex items-center justify-center cursor-pointer"
                      >
                        <Info size={18} className="text-primary-dark" />{" "}
                      </div>
                    </div>
                    <div>
                      <p className="text-base text-primary-dark! font-semibold! mb-1">
                        Status:{" "}
                        {item.claim_status === "claimed" ? (
                          <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                            {item.claim_status
                              ? t("wishlists.detail.claimedBy", {
                                  name: item.claim_status,
                                })
                              : t("wishlists.detail.claimed")}
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            {t("wishlists.detail.available")}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-base text-primary-dark! font-semibold!">
                          Price:{" "}
                          <span className="font-normal!">
                            {item.price} {item.currency}
                          </span>
                        </p>
                        <p className="text-base text-primary-dark! font-semibold!">
                          Quantity:{" "}
                          <span className="font-normal!">
                            {String(item.quantity).padStart(2, "0")}
                          </span>
                        </p>
                      </div>
                    </div>
                    {item.product_url ? (
                      <a
                        href={item.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-dark! hover:underline"
                      >
                        {t("wishlists.detail.viewProduct")}{" "}
                        <ExternalLink className="size-3.5 text-primary" />
                      </a>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </div>
                ))}
              </div>
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
