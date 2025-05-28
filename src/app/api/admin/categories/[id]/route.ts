import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Category } from '@/app/models/Category';

interface Params {
  id: string;
}

// GET a single category by ID
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error);
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error fetching category" }, { status: 500 });
  }
}

// PUT (update) a category by ID
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    const body = await request.json();
    const { name, description, imageUrl } = body; // Destructure expected fields

    // Construct an update object with only the fields provided in the request
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description; // Allow clearing description
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl; // Allow clearing imageUrl
    
    // Prevent updating with an empty object if no relevant fields are sent
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: "No update fields provided" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating category ${params.id}:`, error);
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    // Add more specific error handling if needed, e.g., for validation errors
    return NextResponse.json({ message: "Error updating category" }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Error deleting category ${params.id}:`, error);
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
  }
}