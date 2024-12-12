import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: [true, "Enter the quantity"],
        min: 1,
      },
    },
  ],
  totalDeliveryCost: { type: Number },
  overallTotal: { type: Number },
  billingInfo: {
    firstName: { type: String },
    lastName: { type: String },
    companyName: { type: String },
    country: { type: String },
    streetAddress: { type: String },
    apartment: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    phone: { type: String },
    email: { type: String },
    orderNotes: { type: String },
  },
  deliveryInfo: {
    DeliveryApartment: { type: String },
    DeliveryCity: { type: String },
    DeliveryState: { type: String },
    DeliveryPostalCode: { type: String },
    DeliveryPhone: { type: String },
    DeliveryEmail: { type: String },
    DeliveryOrderNotes: { type: String },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
