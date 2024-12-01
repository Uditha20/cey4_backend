import express from "express";
import Stripe from "stripe";
import Order from "../models/order.js";
import Product from "../models/Product.js";
import { sendOrderEmail } from "../middleware/sendMail.js";

const router = express.Router();
const stripe = new Stripe(process.env.STR_SECRET);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // Verify and construct the event using the raw body and signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!");

        const orderId = paymentIntent.metadata.orderId;

        // Find the order and update its status to 'confirmed'
        const order = await Order.findById(orderId);

        if (order && order.status === "pending") {
          order.status = "confirmed";

          // Save the order and check the result
          const result = await order.save();
          console.log(result);
          if (result && result._id) {
            console.log("Order status updated successfully!");

            try {
              // Send confirmation email
              const result = await Order.findById(orderId)
              .populate("items.product", "name");
              await sendOrderEmail(result.billingInfo.email, result);
              console.log("Order confirmation email sent successfully!");
            } catch (emailError) {
              console.error(
                "Failed to send order confirmation email:",
                emailError
              );
            }
          } else {
            console.error("Failed to update the order status.");
          }
          // Update inventory for each item in the order
          for (const item of order.items) {
            const product = await Product.findById(item.product);

            if (product) {
              product.saleCount += item.quantity;

              // Decrement stock if applicable (assuming you have a stock field)
              if (product.stock) {
                product.stock = Math.max(product.stock - item.quantity, 0);
              }

              await product.save();
            }
          }

          console.log(`Order ${orderId} confirmed and inventory updated.`);
        }
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(
          `Checkout session completed for order ${session.metadata.orderId}`
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Respond with a success status
    res.json({ received: true });
  }
);

export default router;
