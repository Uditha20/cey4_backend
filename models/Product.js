// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    rating: Number,
    supply: Number,
    stock:{
      type:Number,
      default:10
    },
    mainImage: String, // URL or path to the main image
    additionalImages: [{
      type: String, // Array of URLs or paths to additional images
    }], // Array of URLs or paths to additional images
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;
