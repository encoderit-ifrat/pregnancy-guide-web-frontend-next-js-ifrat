import { Metadata } from "next";
import PublicWishlistClient from "./PublicWishlistClient";

export const metadata: Metadata = {
  title: "Önskelista",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PublicWishlistClient />;
}
