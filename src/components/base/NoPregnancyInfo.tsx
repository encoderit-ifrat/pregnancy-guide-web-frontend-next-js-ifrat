import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/providers/I18nProvider";

function NoPregnancyInfo() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          {/* Icon/Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <h2 className="text-2xl font-bold mb-3 bg-primary bg-clip-text text-transparent">
              {t("pregnancy.startJourney")}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("pregnancy.noInfoDesc")}
            </p>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {t("pregnancy.addData")}
            </Link>

            {/* Decorative dots */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            </div>
          </div>

          {/* Helper text */}
          <p className="mt-6 text-sm text-gray-500">
            {t("pregnancy.privacySecure")}
          </p>
        </div>
      </div>
      <section>
        <Image
          src="/assets/logo/waveThird.svg"
          alt="Wave"
          width={1920}
          height={239}
          className="object-cover w-full h-auto"
          priority
        />
      </section>
    </div>
  );
}

export default NoPregnancyInfo;
