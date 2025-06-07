import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Category } from '@/app/models/Category';

// NO INTERFACES (Params, HandlerContext) should be here.

// GET a single category by ID
export async function GET(request: NextRequest, { id }: Params) {
  try {
    await connectMongoDB();
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error fetching category" }, { status: 500 });
  }
}

// PUT (update) a category by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await connectMongoDB();
    const body = await request.json();
    const { name, description, imageUrl } = body;
    const updateData: { [key: string]: any } = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: "No update fields provided" }, { status: 400 });
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error updating category" }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await connectMongoDB();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
  }
}
