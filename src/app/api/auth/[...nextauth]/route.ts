import { authOptions } from "@/utlis/authOptions";
import NextAuth from "next-auth";

// ✅ Export GET and POST as route handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
