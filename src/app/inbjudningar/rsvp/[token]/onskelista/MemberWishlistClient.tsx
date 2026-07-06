"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ExternalLink, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useQueryInvitationWishlist,
  wishlistKeys,
} from "../../../../onskelistor/_api/queries/useQueryWishlists";
import ClaimModal from "../../../../onskelistor/delad/[token]/_component/ClaimModal";
import { MemberWishlistItem } from "../../../../onskelistor/_types/wishlist_types";
import IconHeading from "@/components/ui/text/IconHeading";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

/** Reserver name + message shown inside a reserved item's container. */
function ReserverInfo({ item }: { item: MemberWishlistItem }) {
  const { t } = useTranslation();
  if (item.claim_status !== "claimed" || !item.claimed_by) return null;
  return (
    <div className="mt-2 rounded-[6px] bg-[#F5F1FB] px-3 py-2 text-left">
      <p className="text-xs font-semibold text-primary">
        {t("wishlists.public.reservedBy", { name: item.claimed_by })}
      </p>
      {item.claim_message && (
        <p className="mt-0.5 text-xs text-text-secondary">
          <span className="font-medium">
            {t("wishlists.public.reserverNote")}:
          </span>{" "}
          {item.claim_message}
        </p>
      )}
    </div>
  );
}

export default function MemberWishlistClient() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const qc = useQueryClient();
  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQueryInvitationWishlist(token);

  const [claimItem, setClaimItem] = useState<MemberWishlistItem | null>(null);
  const [infoOpenId, setInfoOpenId] = useState<string | null>(null);

  const refreshWishlist = () =>
    qc.invalidateQueries({ queryKey: wishlistKeys.invitation(token) });

  return (
    <TooltipProvider>
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
              </Card>

              <Card className="mt-6 overflow-x-auto py-[25px] px-2.5 lg:px-[35px] xl:px-[62px] lg:py-10 shadow-week-details border-0">
                <div className="overflow-hidden rounded-2xl lg:border border-[#F3E8FF]">
                  <table className="hidden lg:table w-full min-w-[720px] text-sm">
                    <thead className=" bg-[#F5F1FB] ">
                      <tr className="border-b text-left text-primary-dark border-b-[#F3E8FF]">
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.public.itemsName")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.public.price")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.public.pcs")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.public.claimStatus")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.public.productLink")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlist.items.map((item) => {
                        const claimed = item.claim_status === "claimed";
                        return (
                          <tr
                            key={item._id}
                            onClick={() => !claimed && setClaimItem(item)}
                            className={`border-b last:border-0 ${!claimed ? "cursor-pointer" : ""}`}
                          >
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
                              <ReserverInfo item={item} />
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                {item.product_url ? (
                                  <a
                                    href={item.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                  >
                                    {t("wishlists.public.viewProduct")}{" "}
                                    <ExternalLink className="size-3.5" />
                                  </a>
                                ) : (
                                  <p className="min-w-[110px] text-text-secondary">
                                    —
                                  </p>
                                )}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-2.5 border border-[#F3E8FF] rounded-[5px] text-text-secondary hover:text-primary cursor-pointer"
                                    >
                                      <Info className="size-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    className="bg-white max-w-[250px] border border-[#F3E8FF]"
                                  >
                                    <p>{item.description || "—"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="lg:hidden space-y-4">
                  {wishlist.items.map((item) => (
                    <div
                      key={item._id}
                      onClick={() =>
                        item.claim_status !== "claimed" && setClaimItem(item)
                      }
                      className={`flex flex-col gap-4 border border-[#F3E8FF] rounded-[15px] py-[11px] px-[13px] ${item.claim_status === "claimed" ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-primary-dark!">
                            {item.title}
                          </h3>
                        </div>
                        <Tooltip
                          open={infoOpenId === item._id}
                          onOpenChange={(v) => !v && setInfoOpenId(null)}
                        >
                          <TooltipTrigger asChild>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setInfoOpenId(
                                  infoOpenId === item._id ? null : item._id
                                );
                              }}
                              className="px-[11px] py-2 hover:bg-primary/10 border-0 flex items-center gap-2 cursor-pointer"
                            >
                              <Info size={18} className="text-primary" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className="bg-white border border-[#F3E8FF] max-w-[200px]"
                          >
                            <p className="text-sm! font-normal!">
                              {item.description || "—"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div>
                        <p className="text-base text-primary-dark! font-semibold! mb-1">
                          Status:{" "}
                          {item.claim_status === "claimed" ? (
                            <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                              {t("wishlists.detail.claimed")}
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
                        <ReserverInfo item={item} />
                      </div>
                      {item.product_url ? (
                        <a
                          href={item.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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
          token={wishlist?.share_token ?? ""}
          item={claimItem}
          open={!!claimItem}
          onOpenChange={(v) => !v && setClaimItem(null)}
          onReserved={refreshWishlist}
        />
      </PageContainer>
    </TooltipProvider>
  );
}
