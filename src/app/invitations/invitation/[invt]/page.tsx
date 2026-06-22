import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  CircleCheckBig,
  Download,
  Gift,
  MapPin,
  Plus,
  Send,
  Share2,
  SquarePen,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type pageProps = object;

export default function page({}: pageProps) {
  return (
    <PageContainer>
      <div className="w-full max-w-327 pb-20 mx-auto px-0 mt-8">
        <Link href={"/invitations"} className="flex items-center gap-2">
          <ArrowLeft className="w-8 h-8 bg-primary/10 p-2 text-primary-dark rounded-full" />
          <p className="text-base font-normal">Back to invitations</p>
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 mt-[35px] md:mt-[60px]">
          <div>
            <div className="p-3 bg-white border border-[#F3E8FF] rounded-[25px]">
              <div className="relative w-full h-[146px] md:h-[476px] rounded-[15px] overflow-hidden">
                <Image
                  src={"/images/baby-shower.jpg"}
                  width={700}
                  height={700}
                  alt={"baby-shower"}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-linear-to-b to-[#00000059] from-transparent">
                  <div className="absolute md:bottom-[27px] bottom-2 left-4 md:left-8 ">
                    <h3 className="text-xl! md:text-[35px]! font-semibold! text-white!">
                      Baby Shower Celebration
                    </h3>
                    <p className="text-base! md:text-xl! font-normal text-white!">
                      Celebrating Emma
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full py-[25px] mx-0 md:mx-6 border-b border-b-[#F3E8FF] flex flex-col md:flex-row gap-[15px] md:gap-5 lg:gap-10">
                <div className="grid grid-cols-[40px_200px] gap-4">
                  <div className="h-10 w-10 bg-primary-light2 rounded-full p-2">
                    <Calendar className=" text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-normal">Date & Time</p>
                    <p className="text-base font-semibold!">
                      Saturday, 12 December, 2025
                    </p>
                    <p className="text-base font-normal">11:00 AM - 3:00 PM</p>
                  </div>
                </div>
                <div className="grid grid-cols-[40px_200px] gap-4">
                  <div className="h-10 w-10 bg-primary-light2 rounded-full p-2">
                    <MapPin className=" text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-normal">Location</p>
                    <p className="text-base font-semibold!">
                      1428 Center Par Street, New York, 10038
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-5 mx-0 md:mx-6">
                <h3 className="text-[25px]! font-semibold text-primary-dark!">
                  Message
                </h3>
                <p className="text-base! font-normal mt-3 text-primary-dark!">
                  Join us for a special day as we celebrate the upcoming arrival
                  of our little one. Your presence will make it even more
                  memorable!Join us for a special day as we celebrate the
                  upcoming arrival of our little one. Your presence will make it
                  even more memorable!
                </p>
              </div>
              <div className="px-5 py-[15px] mx-0 md:mx-6 mb-0 md:mb-5 bg-primary-light2 rounded-[15px]">
                <div className="grid grid-cols-[48px_1fr] gap-4">
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                    <Gift className=" text-primary" />
                  </div>
                  <div>
                    <p className="text-xl! font-semibold! text-primary-dark!">
                      Wishlist Attached
                    </p>
                    <p className="text-base! font-normal text-primary-dark!">
                      View gift ideas for Emma
                    </p>
                  </div>
                </div>
                <Link
                  href={"/wishlists"}
                  className="w-full bg-white flex items-center justify-center rounded-full border text-primary font-semibold! mt-3 py-[7px]"
                >
                  View Wishlist
                </Link>
              </div>
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
                    3 / 4 Accepted
                  </Button>
                  <Button
                    variant={"default"}
                    size={"sm"}
                    className="text-base! font-medium"
                  >
                    Add guest
                    <Plus className="w-10 h-10 bg-white rounded-full text-primary!" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="px-5 py-[15px] mx-0 md:mx-6 mb-0 md:mb-5 flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-light2 rounded-[15px]">
                  <div className="grid grid-cols-[48px_1fr] gap-4">
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                      <UserRound className=" text-primary" />
                    </div>
                    <div>
                      <p className="text-xl! font-semibold! text-primary-dark!">
                        Anna Svensson
                      </p>
                      <p className="text-base! font-normal text-primary-dark!">
                        anna@example.com
                      </p>
                    </div>
                  </div>
                  <div className="w-fit px-5 bg-[#DCFCE7] flex items-center justify-center gap-2.5 rounded-full border-0 text-[#00A63E] font-semibold! mt-3 md:mt-0 py-[7px]">
                    <CircleCheckBig />
                    Accepted
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2.5 h-max bg-white border border-[#F3E8FF] rounded-[25px]">
            <div className="px-2 md:px-7 py-[25px] border-b border-b-[#F3E8FF]">
              <p className="text-[25px]! font-semibold mb-5">Action</p>
              <div className="flex flex-col gap-[13px] w-full">
                <Button variant={"default"} className="text-lg font-semibold">
                  <Send />
                  send invitation
                </Button>
                <Button
                  variant={"outline"}
                  className="text-lg font-semibold bg-primary-light2 hover:bg-primary-light2/80"
                >
                  <Share2 />
                  Share Link
                </Button>
                <Button
                  variant={"outline"}
                  className="text-lg font-semibold bg-primary-light2 hover:bg-primary-light2/80"
                >
                  <Download />
                  Download Image
                </Button>
                <Button
                  variant={"outline"}
                  className="text-lg font-semibold bg-primary-light2 hover:bg-primary-light2/80"
                >
                  <SquarePen />
                  Edit Invitation
                </Button>
              </div>
            </div>
            <div className="px-2 md:px-7 py-[25px]">
              <p className="text-[25px]! font-semibold mb-5">Statistics</p>
              <div className="flex flex-col gap-[13px]">
                <div className="flex items-center justify-between">
                  <p>Total Sent</p>
                  <p className="font-semibold!">100</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Viewed</p>
                  <p className="font-semibold!">100</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Accepted</p>
                  <p className="text-[#00A63E]! font-semibold!">100</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Pending</p>
                  <p className="font-semibold!">100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
