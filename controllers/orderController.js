import Order from "../models/order.js";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STR_SECRET);

// Function to create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, overallTotal, billingInfo } = req.body;

    const newOrder = new Order({
      items,

      overallTotal,
      billingInfo,
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully.", orderId: savedOrder._id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to create a payment session
export const paymentSession = async (req, res, next) => {
  const stripe = Stripe(process.env.STR_SECRET);
  const { overallTotal, orderId } = req.body;

  const totalAmountInCents = Math.round(overallTotal * 100);

  const lineItems = [
    {
      price_data: {
        currency: "gbp",
        product_data: {
          name: "Total Order Amount",
        },
        unit_amount: totalAmountInCents,
      },
      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: process.env.MAINURL,
      cancel_url: `${process.env.MAINURL}/login-register`,
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      metadata: {
        orderId: orderId, // This is still useful for the session itself
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          status: "confirmed",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$_id",
          items: {
            $push: {
              product: "$productDetails",
              quantity: "$items.quantity",
            },
          },
          totalDeliveryCost: { $first: "$totalDeliveryCost" },
          overallTotal: { $first: "$overallTotal" },
          billingInfo: { $first: "$billingInfo" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 1,
          items: 1,
          totalDeliveryCost: 1,
          overallTotal: 1,
          billingInfo: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and populate the 'product' field in 'items'
    const order = await Order.findById(orderId)
    .populate("items.product", "name"); // Populate the product reference

    // If no order is found, return a 404 error
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If the order is found, return it
    res.status(200).json(order);
  } catch (error) {
    console.error("Error finding order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};