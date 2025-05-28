import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { User } from "@/app/models/user"; // Assuming your User model is here
import bcrypt from 'bcryptjs'; // You need to install bcryptjs: npm install bcryptjs

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        // Ensure Mongoose is connected
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // If user exists, compare passwords
        if (user && password) {
          // You need to hash passwords during registration and compare the hash here
          // Make sure you have uncommented and implemented password hashing in your User model
          const passwordOk = bcrypt.compareSync(password, user.password);

          if (passwordOk) {
            // Return user object (excluding sensitive info like password hash)
            return { id: user._id.toString(), name: user.email, email: user.email }; // Return minimal user info
          }
        }

        // Return null if credentials are invalid
        return null;
      }
    })
  ],
  // Optional: Add pages for custom sign-in, sign-out, error pages
  // pages: {
  //   signIn: '/login', // Specify your login page path
  // },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('JWT Callback - User:', user); // Removed log
      // console.log('JWT Callback - Token (Before):', token); // Removed log
      if (user) {
        token.id = (user as any).id.toString(); // Ensure id is a string
      }
      // console.log('JWT Callback - Token (After):', token); // Removed log
      return token;
    },
    async session({ session, token }) {
      // console.log('Session Callback - Token:', token); // Removed log
      // console.log('Session Callback - Session (Before):', session); // Removed log
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      // console.log('Session Callback - Session (After):', session); // Removed log
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };