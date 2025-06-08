// File: ./src/app/api/admin/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Category } from '@/app/models/Category'; // Adjust the import path if necessary

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories
 * @access  Public // Change access control as needed
 */
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const categories = await Category.find({}); // Fetch all categories
    return NextResponse.json(categories);
  } catch (error) {
    console.error(`Error in GET /api/admin/categories:`, error);
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
  }
}

/**
 * @route   POST /api/admin/categories
 * @desc    Create a new category
 * @access  Public // Change access control as needed
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const { name, description, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const newCategory = await Category.create({ name, description, imageUrl });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(`Error in POST /api/admin/categories:`, error);
    return NextResponse.json({ message: "Error creating category" }, { status: 500 });
  }
}