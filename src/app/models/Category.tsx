import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  // You might want to add other fields like description or imageUrl for the category
  // description: { type: String },
  imageUrl: { type: String }, // Add imageUrl field
}, { timestamps: true });

export const Category = models?.Category || model('Category', CategorySchema);