import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { User } from "@/app/models/user"; // Assuming your User model is here
import bcrypt from 'bcryptjs'; // You need to install bcryptjs: npm install bcryptjs
import { handlers } from "@/lib/auth"; // Import handlers from your auth.ts file

export const { GET, POST } = handlers;