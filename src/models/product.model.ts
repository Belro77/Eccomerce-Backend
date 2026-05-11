import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: String,
  category: String,
  color: String,
  zodiacSign: String,
  stock: Number,
  description: String
});

export const Product = mongoose.model("Product", productSchema, "products");