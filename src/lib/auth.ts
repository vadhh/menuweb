import { type NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthConfig = {
  providers: [
    // Removed Google provider for simpler login
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // session.user.id = token.id;
        // session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // token.id = user.id;
        // token.role = user.role;
      }
      return token;
    },
  },
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);
