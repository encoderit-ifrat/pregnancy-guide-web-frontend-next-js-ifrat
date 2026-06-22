import { Metadata } from "next";
import CreateInvitationClient from "./CreateInvitationClient";

export const metadata: Metadata = {
  title: "Skapa inbjudan",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CreateInvitationClient />;
}
