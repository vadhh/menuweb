// File: ./src/app/api/admin/categories/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import { Category } from '@/app/models/Category'; // Adjust the import path if necessary

/**
 * @route   GET /api/admin/categories/[id]
 * @desc    Get a single category by ID
 * @access  Public // Change access control as needed
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // <-- CORRECTED TYPE
) {
  try {
    await connectMongoDB();
    const { id } = params;
    
    // Add validation for the ID format if using MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error in GET /api/admin/categories/[id]:`, error);
    return NextResponse.json({ message: "Error fetching category" }, { status: 500 });
  }
}

/**
 * @route   PUT /api/admin/categories/[id]
 * @desc    Update a category by ID
 * @access  Public // Change access control as needed
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // <-- CORRECTED TYPE
) {
  try {
    await connectMongoDB();
    const { id } = params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    
    const body = await request.json();
    // It's good practice to not destructure everything, to avoid saving unwanted fields
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
    console.error(`Error in PUT /api/admin/categories/[id]:`, error);
    return NextResponse.json({ message: "Error updating category" }, { status: 500 });
  }
}

/**
 * @route   DELETE /api/admin/categories/[id]
 * @desc    Delete a category by ID
 * @access  Public // Change access control as needed
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // <-- CORRECTED TYPE
) {
  try {
    await connectMongoDB();
    const { id } = params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: "Invalid Category ID format" }, { status: 400 });
    }
    
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Error in DELETE /api/admin/categories/[id]:`, error);
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
  }
}