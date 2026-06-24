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
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { EventInvitation } from "../_types/invitation_types";
import { formatDate } from "date-fns";

function InvitationCard({ inv }: { inv: EventInvitation }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-[316px] md:max-w-[348px] mx-auto min-h-[483px] bg-white border border-[#F3E8FF] rounded-[15px] p-[5px] shadow-week-details flex flex-col">
      {inv.status === "scheduled" && (
        <div className="absolute top-[14px] right-3 flex items-center justify-center py-1 px-2.5 bg-primary rounded-[5px]">
          <p className="text-xs! font-medium! text-white!">Scheduled</p>
        </div>
      )}
      <Image
        src={inv.cover_image ? inv.cover_image : "/images/default.png"}
        width={700}
        height={700}
        className="w-full h-[176px] object-cover rounded-[10px] shrink-0"
        alt={t("invitations.all")}
      />
      <div className="py-[15px] px-2 flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-primary-dark!">
              {inv.title}
            </h3>
            <p className="text-base font-normal">{inv.subtitle}</p>
          </div>
          <Popover>
            <PopoverTrigger asChild className="cursor-pointer">
              <EllipsisVertical size={20} />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[169px] rounded-[5px] p-0">
              <div className="px-[11px] py-2 hover:bg-primary/10 border-b border-b-[#E8E4F8] flex items-center gap-2 cursor-pointer">
                <Pen size={18} className="text-primary" />{" "}
                <p className="text-sm font-normal">Edit</p>
              </div>
              <div className="px-[11px] py-2 hover:bg-primary/10 border-b border-b-[#E8E4F8] flex items-center gap-2 cursor-pointer">
                <Copy size={18} className="text-primary" />{" "}
                <p className="text-sm font-normal">Duplicate</p>
              </div>
              <div className="px-[11px] py-2 hover:bg-primary/10 flex items-center gap-2 cursor-pointer">
                <Trash2 size={18} className="text-primary" />{" "}
                <p className="text-sm font-normal">Delete</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2 mt-[15px] mb-2">
          <Calendar size={16} className="text-primary" />
          <p>
            {formatDate(inv.event_date || "", "P")} at {inv.event_time}
          </p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-primary" />
          <p>{inv.location}</p>
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
          <div className="rounded-full bg-[#FAF5FF] w-12 h-12 flex justify-center items-center">
            <Share2 className="w-6 h-6 text-primary " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitationCard;
