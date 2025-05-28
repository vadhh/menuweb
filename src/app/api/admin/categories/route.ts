import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Category } from '@/app/models/Category';

// GET all categories
export async function GET() {
  try {
    await connectMongoDB();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
  }
}

// POST a new category
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const { name, description, imageUrl } = body; // Destructure expected fields

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const categoryData: any = { name };
    if (description) {
      categoryData.description = description;
    }
    if (imageUrl) {
      categoryData.imageUrl = imageUrl;
    }

    const newCategory = await Category.create(categoryData);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    // Add more specific error handling if needed, e.g., for validation errors
    return NextResponse.json({ message: "Error creating category" }, { status: 500 });
  }
}