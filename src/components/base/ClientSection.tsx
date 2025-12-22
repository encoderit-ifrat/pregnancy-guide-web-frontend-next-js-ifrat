"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClientCard from "./ClientCard";
import Image from "next/image";
import HeaderText from "../ui/HeaderText";
import EllipseSVG from "../svg/EllipseSVG";

type User = {
  name: string;
  email: string;
  avatar: string | null;
  _id: string;
};

type Review = {
  _id: string;
  userId: string | null;
  user: User;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// For the array
type ReviewsResponse = {
  testimonials: Review[];
};

const ClientSection = ({ testimonials }: ReviewsResponse) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 ? 3 : 1;
    }
    return 3;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  React.useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials?.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleClients = testimonials?.slice(
    currentIndex,
    currentIndex + cardsPerView
  );

  return (
    <section className="relative space-y-20  bg-soft text-soft pb-10 overflow-visible w-full">
      {/* <div className="absolute top-0 left-0 right-0 -translate-y-full ">
        <EllipseSVG />
      </div> */}
      {/* <div className="fixed top-0 left-0 right-0 z-30 h-10 bg-red-500 -translate-y-full"></div> */}
      <HeaderText
        commonText={"Vestibulum"}
        boldText={"HEAR FROM OUR HAPPY CLIENTS"}
        commonClass="text-3xl md:text-5xl text-center"
        boldClass="text-[22px] md:text-[36px] lg:text-[45px] text-center"
      />
      <div className="max-w-5xl mx-auto px-4 m">
        <div className="relative">
          <div
            className={`grid gap-8 ${
              cardsPerView === 3 ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
            } place-items-center`}
          >
            {visibleClients?.map((client: Review, index: number) => (
              <ClientCard
                key={currentIndex + index}
                text={client.content}
                name={client.user.name}
                rating={client.rating}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-soft-white shadow-lg hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-3 rounded-full bg-soft-white shadow-lg hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-purple-600 w-8" : "bg-purple-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientSection;
