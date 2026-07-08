"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
  EllipsisVertical,
  ExternalLink,
  Info,
  Pen,
  Pencil,
  Plus,
  Search,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import Pagination from "@/components/base/Pagination";
import { useQueryWishlistDetail } from "../_api/queries/useQueryWishlists";
import {
  useDeleteWishlistItem,
  useUpdateWishlist,
} from "../_api/mutations/useWishlistMutations";
import AddEditItemModal from "../_component/AddEditItemModal";
import { PublicWishlistItem, WishlistItem } from "../_types/wishlist_types";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { Input } from "@/components/ui/Input";
import EditWishlistModal from "../_component/EditWishlistModal";
import { formatDate } from "date-fns";
import { sv } from "date-fns/locale";

export default function WishlistDetailClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const { data: wishlist, isLoading } = useQueryWishlistDetail(
    id,
    page,
    10,
    search || undefined
  );
  const del = useDeleteWishlistItem();

  const items = wishlist?.items.data ?? [];

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<WishlistItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [infoOpenId, setInfoOpenId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleSearch = () => {
    setSearch(searchTerm);
    setPage(1);
  };
  const handleClear = () => {
    setSearchTerm("");
    setSearch("");
    setPage(1);
  };

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
    <TooltipProvider>
      <PageContainer>
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-[35px] md:my-[53px] cursor-pointer"
          >
            <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
            <p className="text-base font-normal">
              {t("wishlists.detail.back")}
            </p>
          </button>

          {isLoading || !wishlist ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <>
              <Card className="overflow-hidden px-2.5 py-3 lg:p-[17px] rounded-[10px]! shadow-week-details border-0">
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
                      <h1 className="text-xl! md:text-[35px]! font-semibold! mb-0! truncate">
                        {wishlist.title}
                      </h1>
                      {wishlist.description && (
                        <p className="text-base! md:text-xl! font-normal! text-white! truncate">
                          {wishlist.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between lg:mt-[35px] lg:mb-[30px]">
                  <div className="flex-1 w-full lg:max-w-[360px] my-[15px] lg:my-0">
                    <div className="mb-1 lg:mb-2.5 text-sm">
                      <span className="text-primary-text font-medium! text-xl! mr-2.5">
                        {`${wishlist.progress.claimed}/${wishlist.progress.total}`}
                      </span>
                      <span className="text-primary text-base!">
                        {t("wishlists.detail.itemsClaimed")}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${wishlist.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row w-full lg:w-auto gap-2">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="bg-primary-light2 py-2.5 justify-center"
                    >
                      <span className="size-6 bg-primary text-white rounded-full flex items-center justify-center">
                        <Share2 className="size-3" />{" "}
                      </span>
                      {t("wishlists.detail.shareWishlist")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditOpen(true)}
                      className="bg-primary-light2 py-2.5 justify-center"
                    >
                      <Pen className="size-4" />
                      {t("wishlists.detail.edit")}
                    </Button>
                    <Button onClick={openAdd} className="py-2.5">
                      {t("wishlists.detail.addItem")}
                      <Plus className="size-6 p-1 bg-white text-primary rounded-full" />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="mt-6 overflow-x-auto py-[25px] px-2.5 lg:px-[35px] xl:px-[62px] lg:py-10 shadow-week-details border-0">
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 mb-[35px]">
                  <div className="flex flex-col items-start w-full md:w-auto">
                    <p className="text-[25px]! md:text-[30px]! text-primary-dark! font-semibold!">
                      {" "}
                      {wishlist.title}
                    </p>
                    {wishlist.reply_by && (
                      <p className="text-primary-dark! text-base! md:text-[22px]! font-bold">
                        {t("wishlists.detail.latestPurchase", { date: "" })}
                        <span className="text-primary-dark! text-base! font-normal! capitalize">
                          {formatDate(wishlist.reply_by, "MMMM dd, yyyy", {
                            locale: sv,
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!searchTerm) return;
                      handleSearch();
                    }}
                    className={`transition-all duration-300 ease-in-out overflow-hidden w-full sm:w-2xs lg:w-96 opacity-100`}
                  >
                    <Input
                      placeholder={t("header.search")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      prepend={<Search className="size-4 md:size-5" />}
                      className="rounded-[25px]"
                      append={
                        <div className="flex items-center gap-2">
                          {searchTerm && (
                            <X
                              onClick={handleClear}
                              className="h-5 w-5 cursor-pointer"
                            />
                          )}
                          <Button
                            type="submit"
                            className="-mr-3 h-11 rounded-[25px] text-sm px-4 bg-primary text-white hover:bg-primary/90 flex items-center justify-center cursor-pointer"
                          >
                            Sök
                          </Button>
                        </div>
                      }
                    />
                  </form>
                </div>
                <div className="overflow-hidden rounded-2xl lg:border border-[#F3E8FF]">
                  <table className="hidden lg:table w-full min-w-[720px] text-sm">
                    <thead className=" bg-[#F5F1FB] ">
                      <tr className="border-b text-left text-primary-dark border-b-[#F3E8FF]">
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.detail.itemsName")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.detail.claimStatus")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.detail.price")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.detail.pcs")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.detail.productLink")}
                        </th>
                        <th className="px-5 py-3 md:py-[23px] font-semibold text-xl">
                          {t("wishlists.detail.action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-10 text-center text-text-secondary"
                          >
                            {t("wishlists.detail.noItems")}
                          </td>
                        </tr>
                      )}
                      {items.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b  border-b-[#F3E8FF] last:border-0"
                        >
                          <td className="px-5 py-3 font-medium text-base text-primary-dark">
                            {item.title}
                          </td>
                          <td className="px-5 py-3">
                            {item.claim_status === "claimed" ? (
                              <p className="w-fit! rounded-full! bg-primary-light! px-2.5 py-1 text-xs! font-medium! text-primary!">
                                {item.claimed_by &&
                                  t("wishlists.detail.claimed")}
                              </p>
                            ) : (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                {t("wishlists.detail.available")}
                              </span>
                            )}
                            {item.claim_status === "claimed" && (
                              <ReserverInfo item={item} />
                            )}
                          </td>
                          <td className="px-5 py-3 text-base text-primary-dark">
                            {item.price} {item.currency}
                          </td>
                          <td className="px-5 py-3 text-base text-primary-dark">
                            {String(item.quantity).padStart(2, "0")}
                          </td>
                          <td className="px-5 py-3">
                            {item.product_url ? (
                              <a
                                href={item.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center no-underline gap-1 text-base text-primary-dark hover:underline"
                              >
                                {t("wishlists.detail.viewProduct")}{" "}
                                <ExternalLink className="size-3.5 text-primary" />
                              </a>
                            ) : (
                              <span className="text-text-secondary"></span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {item.claim_status === "claimed" ? (
                              <div>
                                <Button
                                  onClick={() => setDeleteId(item._id)}
                                  variant="outline"
                                  className="p-1.5! px-2.5! h-auto! border-0 bg-[#FFEFF0] rounded-full text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                  {t("wishlists.detail.removeTitle")}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2.5">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-2.5 border border-[#F3E8FF] rounded-[5px] text-text-secondary hover:text-primary cursor-pointer">
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
                                <button
                                  onClick={() => openEdit(item)}
                                  className="p-2.5 border border-[#F3E8FF] rounded-[5px] text-text-secondary hover:text-primary"
                                >
                                  <Pencil className="size-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteId(item._id)}
                                  className="p-2.5 border border-[#F3E8FF] rounded-[5px] text-text-secondary hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="lg:hidden space-y-4">
                  {items.map((item) => (
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
                        <Popover>
                          <PopoverTrigger asChild className="cursor-pointer">
                            <EllipsisVertical size={20} />
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-[100px] rounded-[5px] p-0"
                          >
                            <div
                              onClick={() => openEdit(item)}
                              className="px-[11px] py-2 hover:bg-primary/10 border-b border-b-[#E8E4F8] flex items-center gap-2 cursor-pointer"
                            >
                              <Pen size={18} className="text-primary" />{" "}
                              <p className="text-sm font-normal">Edit</p>
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
                                  className="px-[11px] py-2 hover:bg-primary/10 border-b border-b-[#E8E4F8] flex items-center gap-2 cursor-pointer"
                                >
                                  <Info size={18} className="text-primary" />{" "}
                                  <p className="text-sm font-normal">Info</p>
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
                            <div
                              onClick={() => setDeleteId(item._id)}
                              className="px-[11px] py-2 hover:bg-primary/10 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={18} className="text-primary" />{" "}
                              <p className="text-sm font-normal">Delete</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-base text-primary-dark! font-semibold!">
                            {t("wishlists.detail.price")}:{" "}
                            <span className="font-normal!">
                              {item.price} {item.currency}
                            </span>
                          </p>
                          <p className="text-base text-primary-dark! font-semibold!">
                            {t("wishlists.detail.quantity")}:{" "}
                            <span className="font-normal!">
                              {String(item.quantity).padStart(2, "0")}
                            </span>
                          </p>
                        </div>
                        <p className="text-base text-primary-dark! font-semibold!">
                          {t("wishlists.detail.status")}:{" "}
                          {item.claim_status === "claimed" ? (
                            <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                              {item.claimed_by && t("wishlists.detail.claimed")}
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                              {t("wishlists.detail.available")}
                            </span>
                          )}
                        </p>
                        {item.claim_status === "claimed" && (
                          <ReserverInfo item={item} />
                        )}
                      </div>
                      {item.product_url && (
                        <a
                          href={item.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-dark! hover:underline"
                        >
                          {t("wishlists.detail.viewProduct")}{" "}
                          <ExternalLink className="size-3.5 text-primary" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={wishlist.items.pagination.current_page}
                  totalPages={wishlist.items.pagination.last_page}
                  onPageChange={setPage}
                />
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
          <AlertDialogContent className="bg-white border border-[#E8E4F8] rounded-[15px] p-6">
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
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  if (!deleteId) return;
                  del.mutate(
                    { id, itemId: deleteId },
                    {
                      onSuccess: () =>
                        toast.success(t("wishlists.detail.itemRemoved")),
                    }
                  );
                  setDeleteId(null);
                }}
              >
                {t("wishlists.detail.remove")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {wishlist && (
          <EditWishlistModal
            open={editOpen}
            onOpenChange={setEditOpen}
            wishlist={wishlist}
          />
        )}
      </PageContainer>
    </TooltipProvider>
  );
}

function ReserverInfo({ item }: { item: PublicWishlistItem }) {
  const { t } = useTranslation();
  if (item.claim_status !== "claimed" || !item.claimed_by) return null;
  return (
    <div className="mt-2 rounded-[6px] bg-[#F5F1FB] px-3 py-2 text-left">
      <p className="text-xs! font-semibold! mb-0!">
        {t("wishlists.public.reservedBy", { name: item.claimed_by })}
      </p>
      {item.claim_message && (
        <p className="mt-0.5! text-xs! text-text-secondary! max-w-[200px] mb-0!">
          <span className="font-medium">
            {t("wishlists.public.reserverNote")}:
          </span>{" "}
          {item.claim_message}
        </p>
      )}
    </div>
  );
}
