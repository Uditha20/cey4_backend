import Variation from "../models/variation.js";

export const addVariation = async (req, res) => {
  try {
    const price = req.body.price ? JSON.parse(req.body.price) : 0;
    const xlPrice = req.body.xlPrice ? JSON.parse(req.body.xlPrice) : 0;
    const mdPrice = req.body.mdPrice ? JSON.parse(req.body.mdPrice) : 0;

    const mainImage =
      req.files && req.files["mainImage"]
        ? req.files["mainImage"][0].path
        : null;

    const additionalImages =
      req.files && req.files["additionalImages"]
        ? req.files["additionalImages"].map((file) => file.path)
        : [];

    const { name, quantity, productId, itemQty, variationId } = req.body;

    const newVariation = new Variation({
      name,
      quantity,
      itemQty,
      productId,
      variationId,
      price,
      xlPrice,
      mdPrice,
      mainImage,
      additionalImages,
    });

    await newVariation.save();
    res.status(201).json(newVariation);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getVariations = async (req, res) => {
  try {
    const variations = await Variation.find({
      isActive: true,
      isDeleted: false,
    }).populate({
      path: "productId", // The field in Variation schema to populate
      select: "name", // Select specific fields from the Product model (optional)
    });

    res.status(200).json(variations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getVariationsForDashobard = async (req, res) => {
  try {
    const variations = await Variation.find({
      isDeleted: false,
    }).populate({
      path: "productId", // The field in Variation schema to populate
      select: "name", // Select specific fields from the Product model (optional)
    });

    res.status(200).json(variations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getVariation = async (req, res) => {
  const { id } = req.params;
  try {
    const variation = await Variation.findById(id);
    res.status(200).json(variation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, itemQty } = req.body;

    // Parse price from req.body if it exists
    const price = req.body.price ? JSON.parse(req.body.price) : {};

    // Find the existing variation
    let variation = await Variation.findById(id);
    if (!variation) {
      return res.status(404).json({ message: "Variation not found" });
    }

    // Process mainImage
    const mainImage = req.files?.mainImage?.[0]?.path ?? variation.mainImage;

    // Merge new price values with existing ones
    const updatedPrice = {
      basePrice: price.basePrice ?? variation.price.basePrice,
      oneDayPremium: price.oneDayPremium ?? variation.price.oneDayPremium,
      oneDayPremiumSecondItem:
        price.oneDayPremiumSecondItem ??
        variation.price.oneDayPremiumSecondItem,
      twoDayPremium: price.twoDayPremium ?? variation.price.twoDayPremium,
      twoDayPremiumSecondItem:
        price.twoDayPremiumSecondItem ??
        variation.price.twoDayPremiumSecondItem,
    };

    // Update variation
    const updatedVariation = await Variation.findByIdAndUpdate(
      id,
      {
        name: name ?? variation.name,
        quantity: quantity ?? variation.quantity,
        itemQty: itemQty ?? variation.itemQty,
        mainImage,
        price: updatedPrice,
        isActive: true,
        isDeleted: false,
      },
      { new: true }
    );

    res.json(updatedVariation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOneVariation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing variation
    let variation = await Variation.findById(id);
    if (!variation) {
      return res.status(404).json({ message: "Variation not found" });
    }

    const deleteOneProduct = await Variation.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    res.json(deleteOneProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateIsActive = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing variation
    let variation = await Variation.findById(id);
    if (!variation) {
      return res.status(404).json({ message: "Variation not found" });
    }

    const updateIsActive = await Variation.findByIdAndUpdate(
      id,
      { isActive: !variation.isActive },
      { new: true }
    );

    res.json(updateIsActive);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
