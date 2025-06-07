import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Product } from '@/app/models/Product';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params; // AWAIT PARAMS HERE
  // console.log('ProductId accessed at the very start:', productId); // Optional: new log

  try {
    await clientPromise(); // MongoDB connection

    if (!ObjectId.isValid(productId)) {
      console.error('ObjectId.isValid returned false for:', productId);
      return NextResponse.json({ message: 'Invalid product ID format in API' }, { status: 400 });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Consider explicit toObject and toString for _id for consistency
    const responseProduct = {
      ...product.toObject(),
      _id: product._id.toString(),
    };

    return NextResponse.json(responseProduct, { status: 200 });

  } catch (error) {
    console.error('Error fetching product by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}