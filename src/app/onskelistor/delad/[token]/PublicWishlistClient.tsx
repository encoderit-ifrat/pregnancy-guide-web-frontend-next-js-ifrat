"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ExternalLink, Gift, Heart } from "lucide-react";
import { useQueryPublicWishlist } from "../../_api/queries/useQueryWishlists";
import ClaimModal from "./_component/ClaimModal";
import { PublicWishlistItem } from "../../_types/wishlist_types";

export default function PublicWishlistClient() {
  const { token } = useParams<{ token: string }>();
  const { data: wishlist, isLoading, isError } = useQueryPublicWishlist(token);

  const [claimItem, setClaimItem] = useState<PublicWishlistItem | null>(null);

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Heart className="size-4" /> Gift Wishlist
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : isError || !wishlist ? (
          <Card className="mx-auto max-w-md p-10 text-center text-text-secondary">
            This wishlist could not be found or is no longer available.
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden">
              <div className="relative h-56 w-full bg-primary-light">
                {wishlist.cover_image ? (
                  <Image
                    src={wishlist.cover_image}
                    alt={wishlist.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Gift className="size-14 text-primary/50" />
                  </div>
                )}
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
                  Latest day to purchase:{" "}
                  {new Date(wishlist.reply_by).toLocaleDateString("sv-SE")}
                </p>
              )}
            </Card>

            <Card className="mt-6 overflow-x-auto p-0">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left text-text-secondary">
                    <th className="px-5 py-3 font-medium">Items Name</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Pcs</th>
                    <th className="px-5 py-3 font-medium">Claim Status</th>
                    <th className="px-5 py-3 font-medium">Product Link</th>
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
                              Claimed
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                              Available
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
                              View Product <ExternalLink className="size-3.5" />
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
                            {claimed ? "Claimed" : "Claim the gift"}
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
