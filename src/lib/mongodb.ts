// src/lib/mongodb.ts
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    console.log('Attempting to connect with MONGODB_URI:', process.env.MONGODB_URI); // <-- ADD THIS LINE
    if (!process.env.MONGODB_URI) { // <-- ADD THIS CHECK
      throw new Error("MONGODB_URI is undefined! Check .env.local and server restart.");
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Consider not exiting the process here in a Next.js API route,
    // rather throw the error to be handled by the calling API route.
    // For now, to debug, this is fine, but it will stop your app.
    process.exit(1); 
  }
};

export default connectMongoDB;