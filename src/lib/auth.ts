import { type NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from '@/app/models/user'; // Import your User model
import bcrypt from 'bcryptjs'; // Import bcryptjs for password comparison
import connectMongoDB  from '@/lib/mongodb'; // Assuming this is where connectMongoDB is

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" }, // Changed to email for consistency with your User model
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoDB(); // Ensure database connection
        const user = await User.findOne({ email: credentials.email });

        if (user && (await bcrypt.compare(credentials.password as string, user.password))) {
          // Return user object if authentication is successful
          return { id: user._id.toString(), name: user.email, email: user.email }; // You might want to add more user details here
        }
        return null; // Return null if user is not found or credentials are invalid
      },
    }),
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
