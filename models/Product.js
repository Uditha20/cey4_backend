import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    sku: String,
    name: {
      type: String,
      required: [true, "Please provide a product name"],
    },

    price: {
      basePrice: {
        type: Number, // Base price for a normal size product
        required: false,
      },
      oneDayPremium: {
        type: Number, // 1-day premium delivery cost for normal size
        required: false,
      },
      oneDayPremiumSecondItem: {
        type: Number, // 1-day premium delivery cost for normal size
        required: false,
      },

      twoDayPremium: {
        type: Number, // 2-day premium delivery cost for normal size
        required: false,
      },
      twoDayPremiumSecondItem: {
        type: Number, // 2-day premium delivery cost for normal size
        required: false,
      },
    },
    xlPrice: {
      xlBasePrice: {
        type: Number, // Price for extra-large size
        required: false,
      },

      xlOneDayPremium: {
        type: Number, // 1-day premium delivery cost for XL size
        required: false,
      },
      xlOneDayPremiumSecondItem: {
        type: Number,
        required: false,
      },
      xlTwoDayPremium: {
        type: Number, // 2-day premium delivery cost for XL size
        required: false,
      },
      xlTwoDayPremiumSecondItem: {
        type: Number,
        required: false,
      },
    },
    mdPrice: {
      mdBasePrice: {
        type: Number, // Price for medium size
        required: false,
      },
      mdOneDayPremium: {
        type: Number, // 1-day premium delivery cost for Medium size
        required: false,
      },
      mdOneDayPremiumSecondItem: {
        type: Number,
        required: false,
      },
      mdTwoDayPremium: {
        type: Number, // 2-day premium delivery cost for Medium size
        required: false,
      },
      mdTwoDayPremiumSecondItem: {
        type: Number,
        required: false,
      },
    },
    smPrice: {
      basePrice: {
        type: Number, // Price for small size
        required: false,
      },
      oneDayPremium: {
        type: Number, // 1-day premium delivery cost for Small size
        required: false,
      },
      twoDayPremium: {
        type: Number, // 2-day premium delivery cost for Small size
        required: false,
      },
    },

    discount: Number,
    offerEnd: Date,
    new: Boolean,
    rating: Number,
    saleCount: {
      default: 0,
      type: Number,
    },
    category: String, // Array of strings for categories
    tag: [String], // Array of strings for tags
    stock: {
      type: Number,
      default: 0,
    },
    mainImage: String, // URL or path to the main image
    additionalImages: [
      {
        type: String, // Array of URLs or paths to additional images
      },
    ],
    shortDescription: String,
    fullDescription: String,

    brand: {
      type: String,
      default: "EGI",
    },
    condition: {
      type: String,
      default: "Brand New",
    },

    material: String,
    dimensions: {
      dwidth: {
        type: Number,
      },
      dheight: {
        type: Number,
      },
      dlength: {
        type: Number,
      },
    },
    dimensionsMeasure: String,  
    weight: Number,
    weightMeasure: String,
    capacity: String,
    capacityMeasure: String,

    colors: [
      {
        name: {
          type: String, // Color name (e.g., Red, Blue, Black)

        },
        image: {
          type: String, // Image URL for this color
          
        },
      },
    ],
    itemType: String,
    itemRelatedParts:{
      partName: String,
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      length: {
        type: Number,
      },
    },
    features:[String],
    department: String,
    shape: String,
    countryOfManufacture: {
      type: String,
      default: "Sri Lanka",
    },
    indoorOutdoor: String,
    originalReproduction: String,
    handmade: String,
    unitQuantity: String,
    productId: String,
    style: String,
    occasion: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
