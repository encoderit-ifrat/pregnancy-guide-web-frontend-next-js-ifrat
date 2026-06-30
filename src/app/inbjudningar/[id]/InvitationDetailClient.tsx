"use client";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/hooks/useTranslation";
import { toBlob } from "html-to-image";
import { saveAs } from "file-saver";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CircleCheckBig,
  Clock,
  Download,
  Gift,
  MapPin,
  MapPinned,
  Plus,
  Send,
  Share2,
  SquarePen,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackToInv from "../_component/BackToInv";
import { useParams } from "next/navigation";
import { useQueryInvitationDetail } from "../_api/queries/useQueryInvitations";
import {
  useAddRecipients,
  useRemoveRecipient,
  useSendInvitation,
} from "../_api/mutations/useInvitationMutations";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { RsvpStatus } from "../_types/invitation_types";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import { imageLinkGenerator } from "@/helpers/imageLinkGenerator";

type pageProps = object;

export default function InvitationDetailClient({}: pageProps) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: inv, isLoading } = useQueryInvitationDetail(id);
  const addRecipients = useAddRecipients();
  const removeRecipient = useRemoveRecipient();
  const send = useSendInvitation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [captureInv, setCaptureInv] = useState<typeof inv | null>(null);

  const statusLabel = (s: RsvpStatus) => t(`invitations.status.${s}`);

  const handleShare = () => {
    if (!inv) return;
    const url = `${window.location.origin}/inbjudningar/rsvp/${inv.share_token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success(t("invitations.detail.linkCopied")),
      () => toast.error(t("invitations.detail.copyFailed"))
    );
  };

  const handleAddGuest = () => {
    if (!name.trim() || !email.trim())
      return toast.error(t("invitations.detail.enterNameEmail"));
    addRecipients.mutate(
      { id, recipients: [{ name: name.trim(), email: email.trim() }] },
      {
        onSuccess: () => {
          toast.success(t("invitations.detail.guestAdded"));
          setName("");
          setEmail("");
          setAddOpen(false);
        },
      }
    );
  };

  const handleSend = () => {
    send.mutate(
      { id },
      { onSuccess: () => toast.success(t("invitations.detail.invitationSent")) }
    );
  };

  const waitForImages = (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));

    return Promise.all(
      images.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
      )
    );
  };

  const waitForPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

  const handleDownloadImage = async () => {
    // Safety guard: ensure query data matches the current page ID to avoid downloading stale/previous invitation data
    if (!inv || isLoading || inv._id !== id) return;

    setDownloading(true);

    try {
      flushSync(() => setCaptureInv(inv));

      await waitForPaint();

      const node = downloadRef.current;
      if (!node) throw new Error("Download preview is not ready");

      await document.fonts.ready;
      await waitForImages(node);
      await waitForPaint();

      const blob = await toBlob(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        includeQueryParams: true,
        width: 520,
        height: 755,
      });

      if (!blob) throw new Error("Could not generate image");

      saveAs(blob, `${inv.title || "invitation"}-preview.png`);
    } catch (error) {
      console.error("Download image failed:", error);
      toast.error("Failed to download image");
    } finally {
      setCaptureInv(null);
      setDownloading(false);
    }
  };
  // console.log("invitation", inv);
  return (
    <PageContainer>
      <div className="w-full max-w-327 pb-20 mx-auto px-0 mt-8">
        <BackToInv />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 mt-[35px] md:mt-[60px]">
          <div>
            <div className="p-3 bg-white border border-[#F3E8FF] rounded-[25px]">
              <div className="relative w-full h-[146px] md:h-[476px] rounded-[15px] overflow-hidden">
                <Image
                  src={
                    imageLinkGenerator(inv?.cover_image) ||
                    "/images/default.png"
                  }
                  width={700}
                  height={700}
                  alt={"baby-shower"}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-linear-to-b to-[#00000059] from-transparent">
                  <div className="absolute md:bottom-[27px] bottom-2 left-4 md:left-8 ">
                    <h3 className="text-xl! md:text-[35px]! font-semibold! text-white!">
                      {inv?.title}
                    </h3>
                    <p className="text-base! md:text-xl! font-normal text-white!">
                      {inv?.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full py-[25px] mx-0 md:mx-6 border-b border-b-[#F3E8FF] flex flex-col md:flex-row gap-[15px] md:gap-5 lg:gap-10">
                <div className="grid grid-cols-[40px_200px] md:grid-cols-[40px_280px] gap-4">
                  <div className="h-10 w-10 bg-primary-light2 rounded-full p-2">
                    <Calendar className=" text-primary" />
                  </div>
                  <div>
                    <p className="text-base! font-normal!">Date & Time</p>
                    <p className="text-base! font-semibold!">
                      {inv?.event_date
                        ? formatDate(inv.event_date, "PPPP")
                        : ""}
                    </p>
                    <p className="text-base! font-normal!">{inv?.event_time}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[40px_200px] md:grid-cols-[40px_280px] gap-4">
                  <div className="h-10 w-10 bg-primary-light2 rounded-full p-2">
                    <MapPin className=" text-primary" />
                  </div>
                  <div>
                    <p className="text-base! font-normal!">Location</p>
                    <p className="text-base! font-semibold!">{inv?.location}</p>
                  </div>
                </div>
              </div>
              <div className="py-5 mx-0 md:mx-6">
                <h3 className="text-[25px]! font-semibold text-primary-dark!">
                  Message
                </h3>
                <p className="text-base! font-normal mt-3 text-primary-dark!">
                  {inv?.message}
                </p>
              </div>
              {inv?.wishlist && (
                <div className="px-5 py-[15px] flex flex-col lg:flex-row justify-between items-start lg:items-center mx-0 md:mx-6 mb-0 md:mb-5 bg-primary-light2 rounded-[15px]">
                  <div className="grid grid-cols-[48px_1fr] gap-4">
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                      <Gift className=" text-primary" />
                    </div>
                    <div>
                      <p className="text-xl! font-semibold! text-primary-dark!">
                        {t("invitations.detail.wishlistAttached")}
                      </p>
                      <p className="text-base! font-normal text-primary-dark!">
                        {inv?.title}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/onskelistor/${inv?.wishlist}`}
                    className="w-full lg:w-[150px] bg-white flex items-center justify-center rounded-full border text-primary font-semibold! mt-3 lg:mt-0 py-[7px]"
                  >
                    View Wishlist
                  </Link>
                </div>
              )}
            </div>
            <div className="p-3 bg-white border border-[#F3E8FF] rounded-[25px] mt-5">
              <div className="py-[15px] mx-0 md:mx-6 mb-0 md:mb-5 flex flex-col md:flex-row items-start md:items-center justify-between">
                <p className="text-[25px]! font-semibold text-primary-dark!">
                  Guest List
                </p>
                <div className="flex items-center gap-2 mt-2.5 mb-[35px] md:m-0">
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="text-base! font-medium bg-primary-light2 hover:bg-primary-light2/80"
                  >
                    {inv?.statistics.accepted} / {inv?.statistics.total_sent}{" "}
                    Accepted
                  </Button>
                  <Button
                    variant={"default"}
                    size={"sm"}
                    className="text-base! font-medium"
                    onClick={() => setAddOpen(true)}
                  >
                    Add guest
                    <Plus className="w-10 h-10 bg-white rounded-full text-primary!" />
                  </Button>
                </div>
              </div>
              {inv?.guests.length && inv?.guests.length > 0 ? (
                inv.guests.map((guest) => (
                  <div className="flex flex-col gap-3" key={guest._id}>
                    <div className="px-5 py-[15px] mx-0 md:mx-6 mb-0 md:mb-5 flex flex-col md:flex-row items-start md:items-center justify-between bg-[#FCFAFF] rounded-[15px]">
                      <div className="grid grid-cols-[48px_1fr] gap-4">
                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                          <UserRound className=" text-primary" />
                        </div>
                        <div>
                          <p className="text-xl! font-semibold! text-primary-dark! line-clamp-1!">
                            {guest.name}
                          </p>
                          <p className="text-base! font-normal text-primary-dark! line-clamp-1!">
                            {guest.email}
                          </p>
                        </div>
                      </div>
                      {guest.rsvp_status === "accepted" ? (
                        <div className="w-fit px-5 bg-[#DCFCE7] flex items-center justify-center gap-2.5 rounded-full border-0 text-[#00A63E] font-semibold! mt-3 md:mt-0 py-[7px]">
                          <CircleCheckBig />
                          Accepted
                        </div>
                      ) : (
                        <div className="w-fit px-5 bg-[#F2F2F2] flex items-center justify-center gap-2.5 rounded-full border border-[#D1D5DC] text-[#4A5565] font-semibold! mt-3 md:mt-0 py-[7px]">
                          <Clock size={16} />
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center">
                  No guests found
                </div>
              )}
            </div>
          </div>
          <div className="px-2.5 h-max bg-white border border-[#F3E8FF] rounded-[25px]">
            <div className="px-2 md:px-7 py-[25px] border-b border-b-[#F3E8FF]">
              <p className="text-[25px]! font-semibold mb-5">
                {t("invitations.detail.actions")}
              </p>
              <div className="flex flex-col gap-[13px] w-full">
                <Button
                  variant={"default"}
                  onClick={handleSend}
                  disabled={send.isPending}
                  className="text-lg font-semibold"
                >
                  <Send />
                  {t("invitations.detail.sendInvitation")}
                </Button>
                <Button
                  variant={"outline"}
                  onClick={handleShare}
                  className="text-lg font-semibold bg-primary-light2 hover:bg-primary-light2/80 justify-center!"
                >
                  <Share2 />
                  {t("invitations.detail.shareLink")}
                </Button>
                <Button
                  variant={"outline"}
                  onClick={handleDownloadImage}
                  disabled={downloading || !inv}
                  className="text-lg font-semibold bg-primary-light2 hover:bg-primary-light2/80 justify-center!"
                >
                  <Download />
                  {downloading ? "Downloading..." : "Download Image"}
                </Button>
                <Link
                  href={`/inbjudningar/edit/${inv?._id}`}
                  className="text-lg font-semibold w-full flex items-center text-primary py-2 rounded-full border border-primary bg-primary-light2 hover:bg-primary-light2/80 justify-center!"
                >
                  <SquarePen />
                  Edit Invitation
                </Link>
              </div>
            </div>
            <div className="px-2 md:px-7 py-[25px]">
              <p className="text-[25px]! font-semibold mb-5">
                {t("invitations.detail.statistics")}
              </p>
              <div className="flex flex-col gap-[13px]">
                <div className="flex items-center justify-between">
                  <p>{t("invitations.detail.totalSent")}</p>
                  <p className="font-semibold!">{inv?.statistics.total_sent}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>{t("invitations.detail.viewed")}</p>
                  <p className="font-semibold!">{inv?.statistics.viewed}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>{t("invitations.detail.accepted")}</p>
                  <p className="text-[#00A63E]! font-semibold!">
                    {inv?.statistics.accepted}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p>{t("invitations.detail.pending")}</p>
                  <p className="font-semibold!">{inv?.statistics.pending}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-xs md:max-w-sm bg-[#FCFAFF] rounded-[15px] border border-[#F3E8FF]">
            <h2 className="font-outfit! text-xl font-bold text-primary-dark mb-4">
              Add Guest
            </h2>
            <div className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("invitations.detail.guestName")}
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("invitations.detail.email")}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-center"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 justify-center"
                  onClick={handleAddGuest}
                  disabled={addRecipients.isPending}
                >
                  {t("invitations.detail.add")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {captureInv && (
          <div
            aria-hidden="true"
            className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none"
            style={{ zIndex: -100 }}
          >
            <div
              ref={downloadRef}
              className="download-preview-card w-[520px] h-[755px] bg-white overflow-hidden"
            >
              <div className="relative overflow-hidden h-[755px] rounded-[8px] border bg-white shadow-week-details">
                {captureInv.cover_image ? (
                  <img
                    src={`/_next/image?url=${encodeURIComponent(imageLinkGenerator(captureInv.cover_image))}&w=1080&q=75`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-fill"
                  />
                ) : (
                  <div className="p-2">
                    <div className="bg-primary-light2 border border-dashed border-primary rounded-[6px] w-full h-[300px] flex items-center justify-center flex-col">
                      <img
                        src="/images/icons/inv-01.png"
                        alt=""
                        className="w-14 h-14 object-cover"
                      />
                      <p className="text-base! font-semibold! font-outfit!">
                        Template preview
                      </p>
                      <p className="text-sm! font-normal! font-outfit! text-center!">
                        Choose a template in the next step to see your invitation design
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                  <h3 className="font-outfit! text-[22px]! font-semibold! text-primary-dark">
                    {captureInv.title || t("invitations.preview.eventTitle")}
                  </h3>

                  <p className="font-outfit! text-base! text-primary">
                    {captureInv.subtitle || t("invitations.preview.eventSubtitle")}
                  </p>

                  <p className="font-outfit! mx-auto max-w-sm text-base! text-text-secondary mt-2 mb-[9px] line-clamp-2">
                    {captureInv.message || t("invitations.preview.defaultMessage")}
                  </p>

                  <div className="grid grid-cols-3 border-y border-y-[#ECE8F5] gap-3 py-2 text-primary-dark">
                    <p className="font-outfit! flex items-center justify-center gap-1 text-base! leading-normal! border-r border-r-[#ECE8F5]! font-semibold!">
                      <CalendarDays className="size-3.5 text-primary shrink-0" />{" "}
                      <span>
                        {captureInv.event_date
                          ? formatDate(captureInv.event_date, "MMMM MM,yyyy")
                          : t("invitations.preview.defaultdate")}
                      </span>
                    </p>

                    <p className="font-outfit! flex items-center justify-center gap-1 text-base! leading-normal! font-semibold! border-r border-r-[#ECE8F5]!">
                      <Clock className="size-3.5 text-primary shrink-0" />{" "}
                      <span>{captureInv.event_time || t("invitations.preview.defaulttime")}</span>
                    </p>

                    <p className="font-outfit! flex items-center justify-center gap-1 text-base! leading-normal! font-semibold!">
                      <MapPinned className="size-3.5 text-primary shrink-0" />{" "}
                      <span className="leading-[24px]">
                        {captureInv.location || t("invitations.preview.defaultlocation")}
                      </span>
                    </p>
                  </div>

                  <p className="font-outfit! flex items-center justify-center gap-1 pt-1 text-base! leading-normal! font-semibold! text-primary-dark! mt-2">
                    <CalendarDays className="size-3.5 text-primary shrink-0" />
                    {t("invitations.preview.latestReply", {
                      date: captureInv.reply_by ? formatDate(captureInv.reply_by, "MMMM MM,yyyy") : "",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
