import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb'; // Assuming you have a db connection utility
import { Product } from '@/app/models/Product'; // Import the Product model

// GET all products
export async function GET() {
  try {
    await connectMongoDB(); // Connect to the database
    const products = await Product.find({}); // Fetch all products
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB(); // Connect to the database
    const body = await request.json();
    const { name, price, category, description, imageUrl } = body; // Changed categoryId to category

    if (!name || price === undefined || !category) { // Changed categoryId to category in validation
      return NextResponse.json({ message: "Name, price, and category are required" }, { status: 400 }); // Updated error message
    }

    const productData: any = { name, price, category }; // Changed categoryId to category
    if (description) {
      productData.description = description;
    }
    if (imageUrl) {
      productData.imageUrl = imageUrl;
    }

    const newProduct = await Product.create(productData); // Create a new product
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}

// PUT (update by ID)
export async function PUT(request: NextRequest) {
  try {
    await connectMongoDB();
    const id = request.nextUrl.searchParams.get("id"); // Get ID from URL query parameter
    const body = await request.json(); // Renamed updateData to body for consistency
    const { name, price, category, description, imageUrl } = body; // Changed categoryId to category

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (category) updateData.category = category; // Changed categoryId to category
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: "No update fields provided" }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    // Check for CastError (invalid ID format)
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ message: "Invalid Product ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}

// DELETE (delete by ID)
export async function DELETE(request: NextRequest) {
  try {
    await connectMongoDB();
    const id = request.nextUrl.searchParams.get("id"); // Get ID from URL query parameter

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ message: "Invalid Product ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}