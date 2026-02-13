import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/lib/config/env";
import { AUTH_PUBLIC_ROUTES } from "@/lib/config/routes";
import { authController } from "@/lib/controllers/authController";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: AUTH_PUBLIC_ROUTES[0],
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authController.authorizeCredentials(credentials);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return authController.applyJwt(token, user);
    },
    async session({ session, token }) {
      return authController.applySession(session, token);
    },
  },
};
