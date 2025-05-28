import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for an individual item within an order
export interface IOrderItem extends Document {
  productId: mongoose.Schema.Types.ObjectId;
  name: string; // Snapshot of product name at the time of order
  quantity: number;
  price: number; // Snapshot of price per item at the time of order
}

// Mongoose schema for an individual item within an order
const OrderItemSchema: Schema<IOrderItem> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Assuming your product model is named 'Product'
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1.'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative.'],
  },
});

// Interface for the Order document
export interface IOrder extends Document {
  user?: mongoose.Schema.Types.ObjectId; // Optional: if orders are linked to users
  items: IOrderItem[];
  totalAmount: number;
  orderDate: Date;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'; // Example statuses
  // Optional fields for guest checkout or more details
  customerName?: string;
  customerEmail?: string;
  // shippingAddress?: {
  //   street: string;
  //   city: string;
  //   postalCode: string;
  //   country: string;
  // };
}

// Mongoose schema for the Order
const OrderSchema: Schema<IOrder> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: false, // Make it true if orders must be linked to a logged-in user
  },
  items: {
    type: [OrderItemSchema],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative.'],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  customerName: {
    type: String,
    required: false, // Set to true if always required for guest checkouts
  },
  customerEmail: {
    type: String,
    required: false, // Set to true if always required for guest checkouts
    // You might want to add email validation here if used
  },
  // shippingAddress: {
  //   street: String,
  //   city: String,
  //   postalCode: String,
  //   country: String,
  // },
});

// Create and export the Order model
// Check if the model already exists before defining it to prevent OverwriteModelError
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;