import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Copy,
  EllipsisVertical,
  Gift,
  MapPin,
  Pen,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
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
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { EventInvitation } from "../_types/invitation_types";
import { formatDate } from "date-fns";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";
import { useRouter } from "next/navigation";
import {
  useDeleteInvitation,
  useDuplicateInvitation,
} from "../_api/mutations/useInvitationMutations";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";

function InvitationCard({ inv }: { inv: EventInvitation }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: deleteInvitation, isPending } = useDeleteInvitation();
  const { mutate: duplicateInvitation, isPending: isDuplicatePending } =
    useDuplicateInvitation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleShare = () => {
    if (!inv) return;
    const url = `${window.location.origin}/inbjudningar/rsvp/${inv.share_token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success(t("invitations.detail.linkCopied")),
      () => toast.error(t("invitations.detail.copyFailed"))
    );
  };

  return (
    <div className="relative w-full max-w-[316px] md:max-w-[348px] mx-auto h-[483px] bg-white border-1 border-[#F3E8FF] rounded-[15px] p-[5px] shadow-week-details flex flex-col overflow-hidden group transition-all duration-300 hover:border-transparent hover:[background:linear-gradient(white,white)_padding-box,linear-gradient(180deg,rgba(169,122,236,0)_0%,#A97AEC_100%)_border-box]">
      {inv.status === "scheduled" && (
        <div className="absolute z-10 top-[14px] right-3 flex items-center justify-center py-1 px-2.5 bg-primary rounded-[5px]">
          <p className="text-xs! font-medium! text-white!">Scheduled</p>
        </div>
      )}
      <div className="h-[176px] w-full relative shrink-0 overflow-hidden rounded-[10px]">
        <Image
          src={
            inv.cover_image
              ? imageLinkGenerator(inv.cover_image)
              : "/images/default.png"
          }
          fill
          className="object-cover"
          alt={t("invitations.all")}
        />
      </div>
      <div className="py-[15px] px-2 flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-primary-dark! line-clamp-1">
              {inv.title}
            </h3>
            <p className="text-base font-normal line-clamp-1">{inv.subtitle}</p>
          </div>
          <div className="shrink-0">
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <EllipsisVertical size={20} />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[169px] rounded-[5px] p-0"
              >
                <Link
                  href={`/inbjudningar/edit/${inv._id}`}
                  className="px-[11px] py-2 hover:bg-primary/10 border-b border-b-[#E8E4F8] flex items-center gap-2 cursor-pointer"
                >
                  <Pen size={18} className="text-primary" />{" "}
                  <p className="text-sm font-normal">Edit</p>
                </Link>
                <div
                  onClick={() =>
                    duplicateInvitation(inv._id, {
                      onSuccess: (res: any) => {
                        toast.success("Invitation duplicated");
                        const newId = res?.data?.data?._id;
                        if (newId) {
                          router.push(`/inbjudningar/edit/${newId}`);
                        }
                      },
                    })
                  }
                  className="px-[11px] py-2 hover:bg-primary/10 border-b border-b-[#E8E4F8] flex items-center gap-2 cursor-pointer"
                >
                  {isDuplicatePending ? (
                    <Spinner />
                  ) : (
                    <Copy size={18} className="text-primary" />
                  )}
                  <p className="text-sm font-normal">Duplicate</p>
                </div>
                <div
                  onClick={() => setIsDeleteOpen(true)}
                  className="px-[11px] py-2 hover:bg-primary/10 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={18} className="text-primary" />{" "}
                  <p className="text-sm font-normal">Delete</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-[15px] mb-2">
          <Calendar size={16} className="text-primary" />
          <p>
            {formatDate(inv.event_date || "", "P")} at {inv.event_time}
          </p>
        </div>
        <div className="flex items-center gap-2 mb-2 ">
          <MapPin size={16} className="text-primary shrink-0" />
          <p className="line-clamp-1">{inv.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <p>{inv.rsvp_rate || 0} RSVPs</p>
        </div>
        <Link
          href="/wishlists"
          className="w-fit mt-[15px] mb-5 font-normal bg-transparent border border-[#E9D4FF] text-base text-primary px-2.5 py-[4px] rounded-[5px] inline-flex items-center justify-center gap-2"
        >
          <Gift size={18} className="text-primary" />
          {t("invitations.wishlistAttached")}
        </Link>
        <div className="flex items-center w-full gap-2 mt-auto">
          <Link
            href={`/inbjudningar/${inv._id}`}
            className="flex-1 font-semibold bg-[#F6F0FB] border border-primary text-lg text-primary px-4 py-2.5 rounded-full shadow-invitation-box inline-flex items-center justify-center gap-2"
          >
            {t("invitations.viewDetails")}
          </Link>
          <div
            onClick={handleShare}
            className="rounded-full bg-[#FAF5FF] w-12 h-12 flex justify-center items-center cursor-pointer"
          >
            <Share2 className="w-6 h-6 text-primary " />
          </div>
        </div>
      </div>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-white border border-[#E8E4F8] rounded-[15px] p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invitation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                deleteInvitation(inv._id, {
                  onSuccess: () => {
                    toast.success(t("invitations.deleted"));
                    setIsDeleteOpen(false);
                  },
                });
              }}
            >
              {isPending ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default InvitationCard;
