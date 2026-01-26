"use client";

import {Star, Quote} from "lucide-react";
import {Card} from "@/components/ui/Card";
import IconHeading from "@/components/ui/text/IconHeading";
import {Slider} from "@/components/ui/Slider";
import {SwiperSlide} from 'swiper/react';
import {SectionHeading} from "@/components/ui/text/SectionHeading";

export function TestimonialsSection({data}) {
  const pagination = {
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <IconHeading text="Vestibulum" icon={<Quote/>} className="text-primary justify-center"/>
          <SectionHeading>Hear from our happy Clients</SectionHeading>
        </div>

        <div className="relative">
          <div className="sliderOverlay pointer-events-none absolute top-0 bottom-0 left-0 right-0 z-10 h-full w-full"></div>
          <Slider
            options={{
              spaceBetween: 10,
              slidesPerView: 1,
              pagination: pagination,
              autoplay: {
                delay: 1500,
                disableOnInteraction: false,
              },
              breakpoints: {
                640: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }
            }}
          >
            {data && data.length && data.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto flex">
                <Card className="min-h-[220px] h-full flex flex-col border border-gray-100 p-6 transition-shadow hover:shadow-lg">
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({length: testimonial?.rating}).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="mb-4 line-clamp-4 transition-all text-sm leading-relaxed text-text-secondary">
                  {/*<p className="mb-4 line-clamp-4 hover:line-clamp-none transition-all text-sm leading-relaxed text-text-secondary">*/}
                    {testimonial?.content}
                  </p>

                  {/* Author */}
                  <p className="mt-auto font-semibold text-primary">
                    {testimonial?.user?.name}
                  </p>
                </Card>
              </SwiperSlide>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
