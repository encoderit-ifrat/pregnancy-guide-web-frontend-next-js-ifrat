import IconMom from "@/assets/IconMom";
import TrackCard from "./TrackCard";
import HeaderText from "../ui/HeaderText";
import EllipseSVG from "../svg/EllipseSVG";
import { TrackSectionProps } from "./_types/track_section_types";

const TrackSection = ({ articles = [] }: TrackSectionProps) => {
  const modifiedArticles = [...articles].slice(0, 4);
  return (
    <section className=" bg-soft relative  text-background ">
      <HeaderText
        commonText="Vestibulum"
        boldText="TRACK YOUR WEEK"
        commonClass="text-[30px] md:text-[40px] text-center"
        boldClass="text-[36px] md:text-[45px] text-center"
      />
      <div className="px-4">
        <div className="relative py-10 ">
          <div className="relative z-10 w-full flex flex-col md:flex-row max-w-5xl gap-4 md:shadow-[0_0_90px_0_var(--color-bg-shadow)] mx-auto p-4 bg-soft-white rounded-2xl">
            <div className="flex justify-center items-center lg:justify-start flex-1">
              <IconMom />
            </div>

            <div className="flex flex-col flex-1">
              {modifiedArticles?.map((t, index) => (
                <TrackCard
                  key={t.title + index}
                  title={t.title}
                  description={t.excerpt}
                  photoUrl={t.thumbnail_image || t.cover_image}
                  slug={t.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4/6 left-0 bottom-0 right-0 w-full  flex flex-col bg-background overflow-visible">
        <div className="-translate-y-full ">
          <EllipseSVG className="-translate-y-full " />
        </div>
      </div>
    </section>
  );
};

export default TrackSection;
