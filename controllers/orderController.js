import Order from "../models/order.js";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STR_SECRET);

// Function to create a new order
export const createOrder = async (req, res) => {
  try {
    const { user,items, overallTotal, billingInfo, deliveryInfo } = req.body;

    const newOrder = new Order({
      user,
      items,
      overallTotal,
      billingInfo,
      deliveryInfo,
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
      success_url: `${process.env.MAIN_URL}/order-confirm`,
      cancel_url: `${process.env.MAIN_URL}/login-register`,
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
          status: { $ne: "pending" }, // Exclude orders with status "pending"
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          userDetails: {
            $cond: {
              if: { $eq: [{ $size: "$userDetails" }, 0] },
              then: [null], // Set to array with null if no user found
              else: "$userDetails"
            }
          }
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true // Keep orders even if no user
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
          user: { 
            $first: {
              $cond: {
                if: { $ifNull: ["$userDetails", false] },
                then: {
                  _id: "$userDetails._id",
                  name: { $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"] },
                  email: "$userDetails.email",
                  role: "$userDetails.role",
                },
                else: null
              }
            }
          },
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
          status: { $first: "$status" },
          customFullOrderId: { $first: "$customFullOrderId" }
        },
      },
      {
        $project: {
          _id: 1,
          user: 1,
          items: 1,
          totalDeliveryCost: 1,
          overallTotal: 1,
          billingInfo: 1,
          createdAt: 1,
          status: 1,
          customFullOrderId: 1
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

// Function to get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

  
    const order = await Order.findById(orderId).populate(
      "items.product",
      "name"
    ); 

 
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   
    res.status(200).json(order);
  } catch (error) {
    console.error("Error finding order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, trackId, shippingMethod, orderStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: orderStatus, 
        trackId, 
        shippingMethod, 
      },
      { new: true }
    );

   
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
