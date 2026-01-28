"use client";

import {PropsWithChildren} from "react";
import {Swiper} from "swiper/react";
import type {SwiperOptions} from "swiper/types";
import {Autoplay, FreeMode, Navigation, Pagination} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {cn} from "@/lib/utils";

interface SliderProps extends PropsWithChildren {
  options?: SwiperOptions;
  sideOverlayClassName: string;
}

export function Slider({
                         children,
                         options,
                         sideOverlayClassName = "bg-primary-light",
                       }: SliderProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, FreeMode, Autoplay]}
      {...options}
      className="mySwiper !px-6 !py-2 !pb-10"
      style={{
        "--swiper-navigation-color": "#000",
        "--swiper-pagination-color": "#000",
      }}
    >
      {children}

      {/*overlay to hide slide under next button*/}
      <div className={cn(
        "h-full w-[10px] absolute top-0 z-[1] right-0",
        sideOverlayClassName
      )}></div>
      <div className={cn(
        "h-full w-[10px] absolute top-0 z-[1] left-0",
        sideOverlayClassName
      )}></div>
    </Swiper>
  );
}
