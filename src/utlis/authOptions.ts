import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        token: { label: "token", type: "token" },
      },
      async authorize(credentials): Promise<User | null> {
        const accessToken = credentials?.token;
        if (accessToken) {
          return {
            token: accessToken,
            id: accessToken,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return "/";
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user?.token) {
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        token: token.token,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Set session expiration time (30 days in seconds)
    updateAge: 24 * 60 * 60, // Refresh session every 24 hours
  },
 cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // Keep 'lax' for better compatibility
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    // Important: Also configure the CSRF token cookie
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-authjs.csrf-token"
          : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,// Make sure this is set!
  pages: {
    signIn: "/login",
  },
};
