import Order from "../models/order.js";
import Stripe from "stripe";

// Function to create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalDeliveryCost, overallTotal, billingInfo } = req.body;
    // Create new order
    const newOrder = new Order({
      items,
      totalDeliveryCost,
      overallTotal,
      billingInfo,
      createdAt: new Date(),
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    // Respond with the saved order
    res.status(201).json({ message: "Order placed successfully." });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const paymentSession = async (req, res, next) => {
  const stripe = Stripe(
   process.env.STR_SECRET
  );
  const { overallTotal } = req.body;
  const totalAmountInCents = Math.round(overallTotal * 100);
  const lineItems = [
    {
      price_data: {
        currency: "usd",
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
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: process.env.MAINURL, // Adjust these URLs as needed
      cancel_url: `${process.env.MAINURL}/login-register`, // Adjust these URLs as needed
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
