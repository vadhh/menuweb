import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Product } from '@/app/models/Product';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    await clientPromise();

    const { productId } = params;

    // ---- START DEBUG LOGS ----
    console.log('--- API: GET /api/products/[productId] ---');
    console.log('Received productId from URL params:', productId);
    console.log('Type of productId:', typeof productId);
    if (productId) {
      console.log('Length of productId:', productId.length);
    } else {
      console.log('productId is undefined or null');
    }
    // ---- END DEBUG LOGS ----

    if (!ObjectId.isValid(productId)) {
      console.error('ObjectId.isValid returned false for:', productId); // Log this specific case
      return NextResponse.json({ message: 'Invalid product ID format in API' }, { status: 400 });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Consider ensuring the response also has _id as a string for consistency
    const responseProduct = {
      ...product.toObject(), // Get a plain object
      _id: product._id.toString(), // Ensure _id is a string
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