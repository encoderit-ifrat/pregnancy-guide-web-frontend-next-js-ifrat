import { Metadata } from "next";
import MemberWishlistClient from "./MemberWishlistClient";

export const metadata: Metadata = {
  title: "Önskelista",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MemberWishlistClient />;
}
