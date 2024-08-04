import Delivery from "../models/Delivery.js";
import OverallStat from "../models/OverallStat.js";

export const getSales = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();

    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDeliveryCost = async (req, res) => {
  const { cost } = req.body;

  try {
    if (cost == null || typeof cost !== "number") {
      return res.status(400).json({ message: "Invalid cost value" });
    }

    const newDelivery = new Delivery({ cost });

    await newDelivery.save();

    res.status(201).json({message:"new delivery cost add succssfull..",data:newDelivery});
  } catch (error) {

    res.status(500).json({ message: "Server error", error });
  }
};


export const getDeliveryCost = async (req, res) => {
  try {
    const deliveryCost = await Delivery.find();

    res.status(200).json(deliveryCost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};