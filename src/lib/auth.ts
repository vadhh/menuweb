// File: src/lib/auth.ts

import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// You can import other providers here, like Apple, Facebook, etc.

/**
 * Your NextAuth.js configuration options.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here. For example:
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
  ],

  // A secret is required for production environments to encrypt JWTs.
  // Generate one with `openssl rand -base64 32`
  secret: process.env.NEXTAUTH_SECRET,

  // Specify custom pages to override the default NextAuth pages.
  pages: {
    signIn: '/login', // Redirect users to a custom login page.
    // error: '/auth/error', // Error code passed in query string as ?error=
  },

  /**
   * Callbacks are asynchronous functions you can use to control what happens
   * when an action is performed.
   * @see https://next-auth.js.org/configuration/callbacks
   */
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like a user's ID or role from the token.
      if (token && session.user) {
        // Example of adding custom properties to the session object
        // session.user.id = token.id;
        // session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist data to the token right after sign-in.
      if (user) {
        // Example of adding custom properties to the JWT
        // token.id = user.id;
        // token.role = user.role;
      }
      return token;
    },
  },

  // If you need to customize session strategy or use a database adapter,
  // you can configure them here.
  // session: {
  //   strategy: "jwt",
  // },
  // adapter: PrismaAdapter(prisma),
};