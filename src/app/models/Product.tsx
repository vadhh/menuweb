import { Schema, model, models, Types } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }, // Optional description
  price: { type: Number, required: true }, // Store price as a number (e.g., cents or smallest unit)
  imageUrl: { type: String }, // URL for the product image
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to the Category model
  // Add other fields like ingredients, options, etc.
}, { timestamps: true });

export const Product = models?.Product || model('Product', ProductSchema);