import IconHeading from "@/components/ui/text/IconHeading";
import Timeline from "@/components/home/TimeLine";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import Image from "next/image";

export function TrackYourWeekSection() {
  const data = [
    {
      title: "Förlossning article 1",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/5.png",
    },
    {
      title: "Förlossning article 2",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/2.png",
    },
    {
      title: "Förlossning article 3",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/4.png",
    },
    {
      title: "Förlossning article 4",
      description: "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
      thumbnail_image: "/images/track-week/1.png",
    },
  ];

  return (
    <section className="bg-[#FDFBFF] relative">
      <div className="container-xl">
        {/* Dotted Border Container */}
        {/*<div className="rounded-3xl border-2 border-dashed border-primary-muted p-6 md:p-12">*/}
        <div className="rounded-3xl">
          {/* Section Header */}
          <div className="mb-6 md:mb-12 text-center">
            <IconHeading
              text="Vestibulum"
              image="/images/icons/pregnant.png"
              className="text-primary justify-center"
            />
            <SectionHeading>Track your Week</SectionHeading>
          </div>

          <Timeline timelineItems={data} />
        </div>
      </div>
    </section>
  );
}
