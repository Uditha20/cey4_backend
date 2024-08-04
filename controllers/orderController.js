import Order from "../models/order.js";

// Function to create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalDeliveryCost, overallTotal, billingInfo } = req.body;

    // // Validate required fields
    // if (
    //   !items ||
    //   !billingInfo ||
    //   !billingInfo.firstName ||
    //   !billingInfo.lastName ||
    //   !billingInfo.country ||
    //   !billingInfo.streetAddress ||
    //   !billingInfo.city ||
    //   !billingInfo.state ||
    //   !billingInfo.postalCode ||
    //   !billingInfo.phone ||
    //   !billingInfo.email
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "All required fields must be filled." });
    // }

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
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
