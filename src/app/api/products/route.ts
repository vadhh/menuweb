import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Product }  from '@/app/models/Product';

export async function GET() {
  try {
    await clientPromise();
    const products = await Product.find({});
    
    // Ensure _id is a string for each product
    const productsWithIdAsString = products.map(product => ({
      ...product.toObject(),
      _id: product._id.toString(),
    }));

    return NextResponse.json(productsWithIdAsString);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}