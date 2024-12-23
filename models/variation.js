import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  quantity:Number,
  itemQty:Number,
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  variationId: {
    type:String
  },
  price: {
    basePrice: {
      type: Number,
      required: false,
    },
    oneDayPremium: {
      type: Number,
      required: false,
    },
    oneDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
    twoDayPremium: {
      type: Number,
      required: false,
    },
    twoDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
  },
  xlPrice: {
    xlBasePrice: {
      type: Number,
      required: false,
    },
    xlOneDayPremium: {
      type: Number,
      required: false,
    },
    xlOneDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
    xlTwoDayPremium: {
      type: Number,
      required: false,
    },
    xlTwoDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
  },
  mdPrice: {
    mdBasePrice: {
      type: Number,
      required: false,
    },
    mdOneDayPremium: {
      type: Number,
      required: false,
    },
    mdOneDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
    mdTwoDayPremium: {
      type: Number,
      required: false,
    },
    mdTwoDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
  },
  smPrice: {
    smBasePrice: {
      type: Number,
      required: false,
    },
    smOneDayPremium: {
      type: Number,
      required: false,
    },
    smOneDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
    smTwoDayPremium: {
      type: Number,
      required: false,
    },
    smTwoDayPremiumSecondItem: {
      type: Number,
      required: false,
    },
  },
  mainImage: String, 
  additionalImages: [
    {
      type: String, 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Variation= mongoose.model("Variation", VariationSchema);

export default Variation;   