import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { User } from "@/app/models/user"; // Assuming your User model is here
import bcrypt from 'bcryptjs'; // You need to install bcryptjs: npm install bcryptjs

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "text@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        // Ensure Mongoose is connected
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGO_URL as string);
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
            return { id: user._id, name: user.email, email: user.email }; // Return minimal user info
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
});

export { handler as GET, handler as POST };