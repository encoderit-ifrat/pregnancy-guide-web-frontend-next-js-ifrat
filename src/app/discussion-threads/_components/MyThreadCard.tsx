"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

import { MoreHorizontal, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import ThreadDetailPage from "./ThreadDetailPage";
import { Badge } from "@/components/ui/badge";
import IconLove from "@/components/svg-icon/icon-love";
import IconReply from "@/components/svg-icon/icon-reply";
import IconEye from "@/components/svg-icon/icon-eye";
import { Thread } from "../_types/thread_types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
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
import { useMutationDeleteThread } from "../_api/mutations/useThreadMutations";
import { toast } from "sonner";
import EditThreadModal from "./EditThreadModal";

interface MyThreadCardProps {
  id: string;
  title: string;
  description?: string;
  createdBy: {
    name: string;
    time: string;
  };
  stats: {
    likes: number | string;
    replies: number | string;
    views: number | string;
    shares: number | string;
  };
  lastReply?: {
    time: string;
    user: string;
  };
  thread?: Thread;
  className?: string;
  onLike?: () => void;
  onFlag?: () => void;
  onShare?: () => void;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void;
}

export default function MyThreadCard({
  id,
  title,
  description,
  createdBy,
  stats,
  lastReply,
  thread,
  className,
  onLike,
  onFlag,
  onShare,
  onDeleteSuccess,
  onUpdateSuccess,
}: MyThreadCardProps) {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const router = useRouter();
  const [openFlagDialog, setOpenFlagDialog] = React.useState(false);
  const [openReadMoreDialog, setOpenReadMoreDialog] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const isLiked = thread?.likes?.includes(user?._id || "") || false;
  const currentShares = stats.shares;

  const deleteMutation = useMutationDeleteThread();

  const handleAuthAction = (action?: () => void) => {
    if (!user) {
      router.push("/login?callbackUrl=/discussion-threads");
      return;
    }
    action?.();
  };

  const handleLike = () => {
    onLike?.();
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(
        t("threads.deleteSuccess") || "Thread deleted successfully"
      );
      onDeleteSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.message || t("threads.deleteError") || "Failed to delete thread"
      );
    }
  };

  return (
    <>
      <Card
        className={cn(
          "border border-[#F3F4F6] rounded-2xl overflow-hidden bg-white mb-6 cursor-pointer hover:shadow-md transition-shadow shadow-[0px_4px_54px_-2px_rgba(169,122,236,0.15)]",
          className
        )}
        onClick={() => setOpenReadMoreDialog(true)}
      >
        <CardContent className="px-4 py-5 sm:px-8 sm:py-7">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-primary-color leading-tight">
                {title}
              </h3>
              <Badge
                variant="outline"
                className="bg-[#EEE4FD] text-primary-color px-3 py-0.5 rounded-full text-[10px] sm:text-sm font-medium border-none truncate w-fit"
              >
                {t("threads.createdBy")} {createdBy.name} · {createdBy.time}
              </Badge>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-primary-color h-fit w-fit bg-[#F6F0FF] p-1.5 sm:px-2 rounded-full transition-colors hidden sm:block hover:bg-[#EEE4FD]">
                    <MoreHorizontal className="size-4 sm:size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setOpenEditModal(true)}>
                    <Edit2 className="mr-2 size-4" />
                    <span>{t("common.edit") || "Edit"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    <span>{t("common.delete") || "Delete"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-6 ">
            <p className="text-primary-color text-sm sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-[#F3F4F6] sm:gap-x-10">
            <div
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors hover:text-primary",
                isLiked ? "text-primary" : "text-secondary"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleAuthAction(handleLike);
              }}
            >
              <IconLove
                className={cn(
                  "size-3.5 sm:size-4 md:size-5",
                  isLiked ? "text-primary" : "text-secondary"
                )}
              />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {stats.likes} {t("threads.like")}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 text-secondary"
              )}
            >
              <IconReply className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {stats.replies} {t("threads.replies")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-secondary">
              <IconEye className="size-3.5 sm:size-4 md:size-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                {stats.views} {t("threads.views")}
              </span>
            </div>
          </div>
        </CardContent>

        <Dialog open={openFlagDialog} onOpenChange={setOpenFlagDialog}>
          <DialogContent className="sm:max-w-xl text-center bg-white">
            <DialogTitle className="sr-only">
              {t("threads.flagTitle") || "Flag This Content"}
            </DialogTitle>
            <SectionHeading className="m-0 text-center">
              {t("threads.flagTitle") || "Flag This Content"}
            </SectionHeading>
            <p className="text-primary-color text-base text-center">
              {t("threads.flagModeratorNotify") ||
                "This Will Notify Moderators"}
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpenFlagDialog(false)}
                className="w-40"
              >
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button
                className="w-40"
                onClick={(e) => {
                  e.stopPropagation();
                  onFlag?.();
                  setOpenFlagDialog(false);
                }}
              >
                {t("threads.confirmFlag") || "Confirm Flag"}
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openReadMoreDialog} onOpenChange={setOpenReadMoreDialog}>
          <DialogContent className="w-full lg:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-4xl border-none overflow-hidden bg-white">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <ThreadDetailPage
              title={title}
              description={description}
              createdBy={createdBy}
              stats={{ ...stats, shares: currentShares }}
              lastReply={lastReply}
              thread={thread}
              onShare={onShare}
              onClose={() => setOpenReadMoreDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </Card>

      <EditThreadModal
        id={id}
        initialTitle={title}
        initialDescription={description || ""}
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        onSuccess={onUpdateSuccess}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("threads.deleteConfirmTitle") || "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("threads.deleteConfirmDescription") ||
                "This action cannot be undone. This will permanently delete your thread."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground text-white hover:bg-destructive/90"
            >
              {t("common.delete") || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
