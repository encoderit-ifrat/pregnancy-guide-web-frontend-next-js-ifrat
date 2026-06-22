"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryWishlistDetail } from "../_api/queries/useQueryWishlists";
import { useDeleteWishlistItem } from "../_api/mutations/useWishlistMutations";
import AddEditItemModal from "../_component/AddEditItemModal";
import { WishlistItem } from "../_types/wishlist_types";

export default function WishlistDetailClient() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: wishlist, isLoading } = useQueryWishlistDetail(id);
  const del = useDeleteWishlistItem();

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<WishlistItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleShare = () => {
    if (!wishlist) return;
    const url = `${window.location.origin}/onskelistor/delad/${wishlist.share_token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success(t("wishlists.detail.linkCopied")),
      () => toast.error(t("wishlists.detail.copyFailed"))
    );
  };

  const openAdd = () => {
    setEditItem(null);
    setItemModalOpen(true);
  };
  const openEdit = (item: WishlistItem) => {
    setEditItem(item);
    setItemModalOpen(true);
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/onskelistor"
          className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> {t("wishlists.detail.back")}
        </Link>

        {isLoading || !wishlist ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            <Card className="overflow-hidden">
              <div className="relative h-52 w-full bg-primary-light">
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

              <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="min-w-52 flex-1">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {t("wishlists.detail.itemsClaimed", {
                        claimed: wishlist.progress.claimed,
                        total: wishlist.progress.total,
                      })}
                    </span>
                    {wishlist.reply_by && (
                      <span className="text-text-secondary">
                        {t("wishlists.detail.latestPurchase", {
                          date: new Date(wishlist.reply_by).toLocaleDateString(
                            "sv-SE"
                          ),
                        })}
                      </span>
                    )}
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${wishlist.progress.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="size-4" />{" "}
                    {t("wishlists.detail.shareWishlist")}
                  </Button>
                  <Button onClick={openAdd}>
                    <Plus className="size-4" /> {t("wishlists.detail.addItem")}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="mt-6 overflow-x-auto p-0">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-text-secondary">
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.detail.itemsName")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.detail.claimStatus")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.detail.price")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.detail.pcs")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.detail.productLink")}
                    </th>
                    <th className="px-5 py-3 font-medium">
                      {t("wishlists.detail.action")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-text-secondary"
                      >
                        {t("wishlists.detail.noItems")}
                      </td>
                    </tr>
                  )}
                  {wishlist.items.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="px-5 py-3 font-medium text-primary-dark">
                        {item.title}
                      </td>
                      <td className="px-5 py-3">
                        {item.claim_status === "claimed" ? (
                          <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                            {item.claimed_by
                              ? t("wishlists.detail.claimedBy", {
                                  name: item.claimed_by,
                                })
                              : t("wishlists.detail.claimed")}
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            {t("wishlists.detail.available")}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {item.price} {item.currency}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {String(item.quantity).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3">
                        {item.product_url ? (
                          <a
                            href={item.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            {t("wishlists.detail.viewProduct")}{" "}
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : (
                          <span className="text-text-secondary">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(item)}
                            className="text-text-secondary hover:text-primary"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item._id)}
                            className="text-text-secondary hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>

      <AddEditItemModal
        wishlistId={id}
        item={editItem}
        open={itemModalOpen}
        onOpenChange={setItemModalOpen}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("wishlists.detail.removeTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("wishlists.detail.removeDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("wishlists.detail.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteId) return;
                del.mutate(
                  { id, itemId: deleteId },
                  { onSuccess: () => toast.success(t("wishlists.detail.itemRemoved")) }
                );
                setDeleteId(null);
              }}
            >
              {t("wishlists.detail.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
