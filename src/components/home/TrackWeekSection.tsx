import Image from "next/image";
import {FileText, ChevronRight, Zap} from "lucide-react";
import WaveDivider from "@/components/ui/svg/WaveDivider";
import IconHeading from "@/components/ui/text/IconHeading";
import Timeline from "@/components/home/TimeLine";
import {SectionHeading} from "@/components/ui/text/SectionHeading";

const articles = [
  {
    id: 1,
    title: "Förlossning article 1",
    description:
      "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
    image: "/images/track-week/1.png",
    fill: false,
  },
  {
    id: 2,
    title: "Förlossning article 2",
    description:
      "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
    image: "/images/track-week/2.png",
    fill: true,
  },
  {
    id: 3,
    title: "Förlossning article 3",
    description:
      "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
    image: "/images/track-week/3.png",
    fill: true,
  },
  {
    id: 4,
    title: "Förlossning article 4",
    description:
      "Understands activities, behaviors, risks, safety events, and operations through any camera across industries and environments.",
    image: "/images/track-week/5.png",
    fill: true,
  },
];

export function TrackYourWeekSection() {
  return (
    <section className="bg-[#FDFBFF] relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Dotted Border Container */}
        {/*<div className="rounded-3xl border-2 border-dashed border-primary-muted p-6 md:p-12">*/}
        <div className="rounded-3xl  p-6 md:p-12">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <IconHeading text="Vestibulum" icon={<FileText/>} className="text-primary justify-center"/>
            <SectionHeading>Track your Week</SectionHeading>
          </div>

          <Timeline timelineItems={articles}/>
        </div>
      </div>
    </section>
  );
}
