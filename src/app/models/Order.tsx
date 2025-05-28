import { Schema, model, models, Types } from 'mongoose';

const OrderSchema = new Schema({
  userEmail: { type: String }, // Optional: if the user is logged in
  phone: { type: String }, // Customer phone number
  address: { type: String }, // Customer address or table number
  cartItems: [{ // Array of items in the order
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }, // Price of the item at the time of order
    // Add other item details like selected options
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], // Define possible statuses
    default: 'Pending',
  },
  // Add fields for payment status, notes, etc.
}, { timestamps: true });

export const Order = models?.Order || model('Order', OrderSchema);