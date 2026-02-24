import { BookOpen, Baby } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ArticleStats() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full max-w-[700px] mx-auto mt-8 px-4">
      {/* Articles Card */}
      <div className="group flex-1 bg-soft text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-5 sm:p-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-1">
          <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 sm:h-5 sm:w-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-base font-semibold tracking-wide mt-1 sm:mt-0">
            {t("pregnancyOverview.articles")}
          </h3>
        </div>
        <p className="text-4xl sm:text-3xl font-extrabold group-hover:scale-105 transition-transform duration-300">
          1,000+
        </p>
      </div>

      {/* Baby Names Card */}
      <div className="group flex-1 bg-secondary text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 p-5 sm:p-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-1">
          <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
            <Baby className="h-6 w-6 sm:h-5 sm:w-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-base font-semibold tracking-wide mt-1 sm:mt-0">
            {t("pregnancyOverview.babyNames")}
          </h3>
        </div>
        <p className="text-4xl sm:text-3xl font-extrabold group-hover:scale-105 transition-transform duration-300">
          0
        </p>
      </div>
    </div>
  );
}
