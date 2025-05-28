import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/app/models/user';
// Assuming you have a User model imported somewhere, e.g., import User from '@/models/User';
// Make sure your User model is correctly defined and imported.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;

    // TODO: Add input validation here (e.g., check email format, password length)

    if (password !== confirmPassword) {
        return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    // Ensure Mongoose is connected (consider connecting outside the handler for better performance in production)
    if (mongoose.connection.readyState !== 1) {
       await mongoose.connect(process.env.MONGO_URL as string);
    }

    // TODO: Check if user already exists before creating
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }


    // Create user, password hashing is handled by the pre-save hook in the User model
    const createdUser = await User.create({ email, password }); // Only pass email and password

    // Return a success response, typically with status 201 for resource creation
    return NextResponse.json(createdUser, { status: 201 });

  } catch (error) {
    console.error('Registration failed:', error);
    // Return an error response
    return NextResponse.json({
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}

// If you only want to allow POST, you don't need to export other methods.
// If you wanted to handle GET requests, you would add:
// export async function GET(request: Request) {
//   return NextResponse.json({ message: 'GET method not allowed' }, { status: 405 });
// }