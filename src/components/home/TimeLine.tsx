// components/Timeline.tsx
import Image from "next/image";
import {ChevronRight} from "lucide-react";
import {imageLinkGenerator} from "@/helpers/imageLinkGenerator";
import Link from "next/link";


export default function Timeline({timelineItems}) {
  console.log("👉 ~ Timeline ~ timelineItems:", timelineItems);
  return (
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        {/* Center line (desktop only) */}
        <div className="absolute md:left-1/2 top-0 hidden h-full w-px translate-x-0 md:-translate-x-1/2 bg-purple-200 md:block"/>

        <div className="space-y-16">
          {timelineItems && timelineItems.length && timelineItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
                <div
                    key={item._id}
                    className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2"
                >
                  {/* Timeline dot */}
                  {item.fill ?
                      <span className="absolute -left-[10px] md:left-1/2 top-1/2 z-10 hidden h-3 w-3 md:-translate-x-1/2 -translate-y-1/2 rounded-full bg-primary md:block"/>
                      :
                      <span className="absolute -left-[10px] md:left-1/2 top-1/2 z-10 hidden h-3 w-3 md:-translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white md:block"/>
                  }

                  {/* Content Card */}
                  <div
                      className={`${
                          isEven ? "order-2 md:order-1 md:pr-5 lg:pr-10 md:text-right" : "order-2 md:pl-5 lg:pl-10"
                      }`}
                  >
                    <div className="group relative rounded-2xl bg-white p-6 overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                          ✿
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 text-left pb-6">
                        {item.excerpt}
                      </p>

                      <div className="absolute -bottom-10 -right-10 transition-transform duration-300 group-hover:scale-130">
                        <Link href={`/articles/${item?.slug || "article-not-found"}`}>
                          <button className="h-20 w-20 bg-primary text-white transition rounded-full relative cursor-pointer">
                            <ChevronRight className="h-6 w-6 text-white absolute top-[16px] left-[10px]"/>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div
                      className={` ${
                          isEven ? "order-1 md:order-2 md:pl-10 lg:pl-20" : "order-1 md:pr-10 lg:pr-20"
                      }`}
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                      <Image
                          src={imageLinkGenerator(item?.thumbnail_image)}
                          alt={item.title}
                          fill
                          className="object-cover"
                      />
                    </div>
                  </div>
                </div>
            );
          })}
        </div>
      </section>
  );
}
