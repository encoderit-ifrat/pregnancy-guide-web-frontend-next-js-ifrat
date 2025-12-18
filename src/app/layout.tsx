import "./globals.css";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/QueryProvider";
import Navbar from "@/components/Navbar/Navbar";
import { Roboto, Poppins, Playfair_Display } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import SessionWrapper from "@/components/session/SessionWrapper";
import { Toaster } from "sonner";
import { UserProvider } from "@/providers/UserProvider";

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

export const metadata: Metadata = {
  title: "Familj",
  description: "Familj project setup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${poppins.variable} ${playfair.variable}`}
    >
      <body className={`${roboto.className} ${poppins.variable} w-full`}>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <Navbar />
              <UserProvider>
                {children}
                <Toaster richColors position="top-right" />
              </UserProvider>
              <Footer />
            </ReactQueryProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
