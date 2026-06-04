import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Heart, Sparkles, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/text/SectionHeading";
import IconHeading from "@/components/ui/text/IconHeading";
import { PageContainer } from "@/components/layout/PageContainer";
import Image from "next/image";
import { OG_DEFAULT_IMAGE, canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Barnnamn | Hitta barnets namn tillsammans",
  description:
    "Hitta barnets namn tillsammans med din partner. Swajpa er igenom tusentals namn, spara favoriter och se vilka ni båda gillar. Skapa konto gratis.",
  alternates: {
    canonical: canonicalUrl("/barnnamn"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Barnnamn | Hitta barnets namn tillsammans",
    description:
      "Hitta barnets namn tillsammans med din partner. Swajpa er igenom tusentals namn, spara favoriter och se vilka ni båda gillar. Skapa konto gratis.",
    type: "website",
    locale: "sv_SE",
    siteName: "Familj.se",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barnnamn | Hitta barnets namn tillsammans",
    description:
      "Hitta barnets namn tillsammans med din partner. Swajpa er igenom tusentals namn, spara favoriter och se vilka ni båda gillar. Skapa konto gratis.",
    images: [{ url: OG_DEFAULT_IMAGE }],
  },
};

export default function BarnnamnHubPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-screen py-10">
        {/* Section Label */}
        <div className="mb-4">
          <IconHeading
            text="BARNNAMN"
            className="text-primary justify-center"
          />
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl px-4 mb-8">
          <SectionHeading className="m-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-color">
            Hitta det perfekta namnet till ert barn
          </SectionHeading>
          <p className="mt-4 text-base sm:text-lg text-primary-color opacity-80 max-w-2xl mx-auto leading-relaxed">
            Att välja barnnamn är ett av de mysigaste besluten under graviditeten. 
            Med vår unika namnswajp kan du och din partner gå igenom tusentals namn 
            och se direkt när ni har en matchning!
          </p>
        </div>

        {/* Interactive Image & CTA Grid */}
        <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="relative h-64 sm:h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-purple-100 bg-gradient-to-tr from-purple-100 via-pink-50 to-white flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200/30 via-transparent to-transparent animate-pulse" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="size-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-rose-500 animate-bounce">
                <Heart size={36} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-[#3D3177]">Namnswajpen</h3>
              <p className="text-sm text-primary-color max-w-xs">
                Gilla eller ogilla tusentals svenska och internationella barnnamn.
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-primary-color mb-2 flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                Hur fungerar det?
              </h3>
              <ul className="space-y-4 text-sm text-primary-color">
                <li className="flex gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="font-semibold block text-[#3D3177]">Välj kategorier</strong>
                    Filtrera namn baserat på kön (pojknamn, flicknamn, unisex) eller olika stilar som klassiska, moderna eller korta namn.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="font-semibold block text-[#3D3177]">Bjud in din partner</strong>
                    Koppla ihop era konton med ett enkelt klick så att systemet kan matcha era val i realtid.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="font-semibold block text-[#3D3177]">Se era gemensamma favoriter</strong>
                    Få en delad lista på alla namn ni båda har gett ett hjärta till. Sortera, rösta och bestäm er i lugn och ro.
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <Link href="/barnnamn/swajp" className="w-full sm:w-1/2">
                <Button className="w-full font-semibold h-12 text-base rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Börja swajpa
                  <ChevronRight size={18} />
                </Button>
              </Link>
              <Link href="/barnnamn/swajp/matchade" className="w-full sm:w-1/2">
                <Button variant="outline" className="w-full font-semibold h-12 text-base rounded-full border-2 border-[#DED7F1] text-primary-color hover:bg-[#F6F0FF] flex items-center justify-center gap-2">
                  <Users size={18} />
                  Matchade namn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
