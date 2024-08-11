// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    sku: String,
    name: String,
    price: Number,
    discount: Number,
    offerEnd: Date,
    new: Boolean,
    rating: Number,
    saleCount: {
      default:0,
      type:Number
    },
    category: [String], // Array of strings for categories
    tag: [String], // Array of strings for tags
    stock: {
      type: Number,
      default: 0
    },
    mainImage: String, // URL or path to the main image
    additionalImages: [{
      type: String, // Array of URLs or paths to additional images
    }], // Array of URLs or paths to additional images
    shortDescription: String,
    fullDescription: String,
    deliveryCost: String
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;
