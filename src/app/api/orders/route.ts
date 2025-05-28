import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Corrected import path
import Order, { IOrderItem } from '@/lib/models/Order'; // Ensure Order model is imported
import connectMongoDB from '@/lib/mongodb';

interface OrderRequestBody {
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  // Optional: customerName, customerEmail if handling guest checkouts
  customerName?: string;
  customerEmail?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    const body = await req.json() as OrderRequestBody;
    const { items, customerName, customerEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Order items cannot be empty.' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of items) {
      if (!item.productId || !item.name || item.quantity == null || item.price == null) {
        return NextResponse.json({ message: 'Missing fields in one or more order items.' }, { status: 400 });
      }
      if (item.quantity <= 0) {
        return NextResponse.json({ message: `Quantity for item ${item.name} must be positive.` }, { status: 400 });
      }
      if (item.price < 0) {
        return NextResponse.json({ message: `Price for item ${item.name} cannot be negative.` }, { status: 400 });
      }

      // Optional: You might want to re-verify product existence and price from DB for security
      // const product = await Product.findById(item.productId);
      // if (!product) {
      //   return NextResponse.json({ message: `Product with ID ${item.productId} not found.` }, { status: 404 });
      // }
      // // Use product.price from DB instead of client-side price for security
      // const currentPrice = product.price;
      // totalAmount += item.quantity * currentPrice;
      // orderItems.push({
      //   productId: item.productId as unknown as mongoose.Schema.Types.ObjectId, 
      //   name: product.name, // Use name from DB
      //   quantity: item.quantity,
      //   price: currentPrice,
      // } as IOrderItem);

      // Using client-side price and name as per current requirement (snapshot)
      totalAmount += item.quantity * item.price;
      orderItems.push({
        productId: item.productId as unknown as mongoose.Schema.Types.ObjectId, // Casting to ObjectId
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      } as IOrderItem);
    }

    const newOrderData: any = {
      items: orderItems,
      totalAmount,
      status: 'Pending',
    };

    if (session?.user?.id) { // Change from session?.user?.email to session?.user?.id
      newOrderData.user = session.user.id as unknown as mongoose.Schema.Types.ObjectId; // Cast to ObjectId
    } else {
      // Handle guest checkout: ensure customerName and customerEmail are provided if required
      if (!customerName || !customerEmail) {
        // return NextResponse.json({ message: 'Customer name and email are required for guest checkout.' }, { status: 400 });
        // For now, we'll allow orders without user or guest details if not provided
      }
      newOrderData.customerName = customerName;
      newOrderData.customerEmail = customerEmail;
    }

    const newOrder = new Order(newOrderData);
    await newOrder.save();

    return NextResponse.json({ message: 'Order created successfully!', orderId: newOrder._id, order: newOrder }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create order. Internal server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB(); // Using the utility function

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'counts') {
      const pendingCount = await Order.countDocuments({ status: 'Pending' });
      const completedCount = await Order.countDocuments({ status: 'Completed' });
      const processedCount = await Order.countDocuments({ status: 'Processed' });

      return NextResponse.json({ pending: pendingCount, completed: completedCount, processed: processedCount }, { status: 200 });
    }

    const orders = await Order.find({}).populate('user', 'email name').sort({ orderDate: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders', error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add authorization to ensure only admins can update orders
    // if ((session.user as any).role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const body = await req.json();
    const { orderId, status } = body; // Expecting orderId and the new status

    if (!orderId || !status) {
      return NextResponse.json({ message: 'Order ID and status are required.' }, { status: 400 });
    }

    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order updated successfully!', order: updatedOrder }, { status: 200 });

  } catch (error) {
    console.error('Error updating order:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update order. Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add authorization to ensure only admins can delete orders
    // if ((session.user as any).role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required.' }, { status: 400 });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully!', order: deletedOrder }, { status: 200 });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ message: 'Failed to delete order. Internal server error.' }, { status: 500 });
  }
}