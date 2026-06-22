import { Metadata } from "next";
import PublicInvitationClient from "./PublicInvitationClient";

export const metadata: Metadata = {
  title: "Du är inbjuden",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PublicInvitationClient />;
}
