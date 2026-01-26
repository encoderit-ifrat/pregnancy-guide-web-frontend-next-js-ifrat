"use client";

import {Star, Quote} from "lucide-react";
import {Card} from "@/components/ui/Card";
import IconHeading from "@/components/ui/text/IconHeading";
import {Slider} from "@/components/ui/Slider";
import {SwiperSlide} from 'swiper/react';
import {SectionHeading} from "@/components/ui/text/SectionHeading";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Rahman",
    rating: 5,
    text: "The onboarding experience was straightforward and the UI felt intuitive from day one. We were able to roll this out to our team with minimal guidance, which saved us a significant amount of time.",
  },
  {
    id: 2,
    name: "Daniel Foster",
    rating: 4,
    text: "Overall a solid product. Performance has been reliable and support is responsive. There are a few advanced features we’d like to see, but what’s there today works very well for our use case.",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    rating: 5,
    text: "We’ve tried several alternatives before, but this is the first solution that actually fit into our existing workflow without requiring major changes. Adoption across the team was quick.",
  },
  {
    id: 4,
    name: "Michael Chen",
    rating: 5,
    text: "What stood out most was the attention to detail. Small things like sensible defaults and clear error messages make a big difference in day-to-day usage.",
  },
  {
    id: 5,
    name: "Sarah Collins",
    rating: 4,
    text: "The platform is well thought out and easy to maintain. Reporting features are especially useful for management reviews. Looking forward to future updates.",
  },
  {
    id: 6,
    name: "Arif Mahmud",
    rating: 5,
    text: "Implementation was faster than expected and the documentation covered almost everything we needed. Any remaining questions were quickly resolved by support.",
  },
  {
    id: 7,
    name: "James O’Neill",
    rating: 5,
    text: "This has become a core part of our daily operations. It reduced manual work and improved visibility across teams, which was exactly what we were looking for.",
  },
  {
    id: 8,
    name: "Fatima Khan",
    rating: 4,
    text: "Clean design, consistent behavior, and no unnecessary complexity. It feels like the product was built with real users in mind rather than just features.",
  },
];

export function TestimonialsSection() {
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
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto flex">
                <Card className="min-h-[220px] h-full flex flex-col border border-gray-100 p-6 transition-shadow hover:shadow-lg">
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({length: testimonial.rating}).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="mb-4 line-clamp-4 transition-all text-sm leading-relaxed text-text-secondary">
                  {/*<p className="mb-4 line-clamp-4 hover:line-clamp-none transition-all text-sm leading-relaxed text-text-secondary">*/}
                    {testimonial.text}
                  </p>

                  {/* Author */}
                  <p className="mt-auto font-semibold text-primary">
                    {testimonial.name}
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
