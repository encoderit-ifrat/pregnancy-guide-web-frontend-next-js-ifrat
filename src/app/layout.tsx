import "./globals.css";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/QueryProvider";
import {
  Roboto,
  Poppins,
  Playfair_Display,
  Outfit,
  Libre_Baskerville,
} from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import SessionWrapper from "@/components/session/SessionWrapper";
import { Toaster } from "sonner";
import { UserProvider } from "@/providers/UserProvider";
import { Header } from "@/components/layout/Header";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { Footer } from "@/components/layout/Footer";
import FooterWaveDivider from "@/components/layout/svg/FooterWaveDivider";

// Outfit font
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"], // add any weights you need
  variable: "--font-outfit",
  display: "swap",
});
// Roboto font
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"], // add any weights you need
  variable: "--font-roboto",
  display: "swap",
});

// Poppins font
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Playfair Display font
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

// Libre Baskerville font
export const libre_baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre_baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Familj",
  description: "Familj project setup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // /pregnancy-overview

  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${roboto.variable} ${poppins.variable} ${playfair.variable} ${outfit.variable} ${libre_baskerville.variable} antialiased text-primary-dark`}
      >
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <Header />
              <UserProvider>
                {children}
                <Toaster richColors position="top-right" />
              </UserProvider>
              {/* divider */} <FooterWaveDivider />
              <Footer />
            </ReactQueryProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
