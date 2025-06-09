import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",

  },
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
    DeliveryFullName: { type: String },
    DeliveryStreetAddress: { type: String },
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
    default: "pending",
  },
  trackId: { type: String },
  shippingMethod: { type: String },
  createdAt: { type: Date, default: Date.now },
  customOrderId: { type: Number }, 
  customFullOrderId: { type: String }, 
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
