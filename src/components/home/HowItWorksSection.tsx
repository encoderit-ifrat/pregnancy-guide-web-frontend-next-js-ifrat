import Image from "next/image";
import { Heart, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import IconHeading from "@/components/ui/text/IconHeading";
import VCard from "@/components/ui/cards/VCard";
import { SectionHeading } from "@/components/ui/text/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Track Your Week",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent.",
    image: "/images/articles/2.png",
  },
  {
    number: "02",
    title: "Access Expert Content",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent.",
    image: "/images/articles/3.png",
  },
  {
    number: "03",
    title: "Use Smart Checklists",
    description: "Suspendisse vitae risus Cras nulla blandit Praesent.",
    image: "/images/articles/1.png",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-10 md:pb-10">
      <div className="section">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <IconHeading
            text="Step-by-Step"
            image="/images/icons/baby-face.png"
            className="text-primary justify-center"
          />
          <SectionHeading>How it Works</SectionHeading>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-5 justify-center sm:grid-cols-2 md:grid-cols-3">
          {steps.map((step, index) => (
            <VCard key={index} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
