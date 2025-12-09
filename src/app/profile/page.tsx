import Image from "next/image";
import ProfilePage from "./_component/profile";

export default function page() {
  return (
    <div className="pb-56">
      <div className="flex  items-center justify-center pt-20 lg:pt-30 pb-20 lg:pb-60">
        <ProfilePage />
      </div>
      {/* <Image
        src="/assets/logo/vectorSecond.svg"
        alt="Wave"
        width={1920}
        height={239}
        className="w-full h-auto object-cover"
        priority
      /> */}
    </div>
  );
}
