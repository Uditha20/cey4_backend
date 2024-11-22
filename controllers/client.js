import Product from "../models/Product.js";
// import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
// import getCountryIso3 from "country-iso-2-to-3";
// controllers/productController.js

export const addProduct = async (req, res) => {
  try {
    const {
      sku = "", // default to empty string
      name = "",
      discount = 0, // default to 0
      offerEnd = null, // default to null for date values
      new: isNew = false, // default to false for boolean values
      rating = 0,
      saleCount = 0,
      category = [],
      tag = [],
      stock = 0,
      shortDescription = "",
      fullDescription = "",
      brand = "",
      condition = "",
      material = "",
      weight = 0,
      weightMeasure = "",
      capacity = 0,
      capacityMeasure = "",
      colours = [], // default to an empty array
      itemType = "",
      features = [],
      department = "",
      shape = "",
      countryOfManufacture = "",
      indoorOutdoor = "",
      originalReproduction = "",
      handmade = false,
      unitQuantity = 1, // default to 1 for quantity
      productId = "",
      style = "",
      occasion = "",
    } = req.body;

    // Parse JSON values or set default empty object/array
    const price = req.body.price ? JSON.parse(req.body.price) : 0;
    const xlPrice = req.body.xlPrice ? JSON.parse(req.body.xlPrice) : 0;
    const mdPrice = req.body.mdPrice ? JSON.parse(req.body.mdPrice) : 0;
    const itemRelatedParts = req.body.itemRelatedParts
      ? JSON.parse(req.body.itemRelatedParts)
      : { partName: "", width: 0, height: 0, length: 0 }; // default structure
    const dimensions = req.body.dimensions
      ? JSON.parse(req.body.dimensions)
      : { width: 0, height: 0, length: 0 }; // default structure

    // Handle file uploads, default to null or empty array
    const mainImage =
      req.files && req.files["mainImage"]
        ? req.files["mainImage"][0].path
        : null;
    const additionalImages =
      req.files && req.files["additionalImages"]
        ? req.files["additionalImages"].map((file) => file.path)
        : [];

    const newProduct = new Product({
      sku,
      name,
      price,
      xlPrice,
      mdPrice,
      discount,
      offerEnd,
      new: isNew,
      rating,
      saleCount,
      category,
      tag,
      stock,
      shortDescription,
      fullDescription,
      mainImage,
      additionalImages,
      brand,
      condition,
      material,
      weight,
      weightMeasure,
      capacity,
      capacityMeasure,
      colours,
      dimensions,
      itemType,
      features,
      department,
      shape,
      countryOfManufacture,
      indoorOutdoor,
      originalReproduction,
      handmade,
      unitQuantity,
      productId,
      style,
      itemRelatedParts,
      occasion,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      sku,
      discount,
      "dimensions.dheight": dheight,
      "dimensions.dwidth": dwidth,
      "dimensions.dlength": dlength,
      "price.basePrice": basePrice,
      "price.oneDayPremium": oneDayPremium,
      "price.oneDayPremiumSecondItem": oneDayPremiumSecondItem,
      "price.twoDayPremium": twoDayPremium,
      "price.twoDayPremiumSecondItem": twoDayPremiumSecondItem,
    } = req.body;
    const mainImage =
      req.files && req.files["mainImage"] && req.files["mainImage"].length > 0
        ? req.files["mainImage"][0].path
        : product.mainImage; // Keep existing mainImage if none provided

    const additionalImages =
      req.files &&
      req.files["additionalImages"] &&
      req.files["additionalImages"].length > 0
        ? req.files["additionalImages"].map((file) => file.path)
        : product.additionalImages; // Keep existing additionalImages if none provided

    // Build the dimensions and price objects
    const dimensions = {
      dheight: dheight || product.dimensions.dheight,
      dwidth: dwidth || product.dimensions.dwidth,
      dlength: dlength || product.dimensions.dlength,
    };

    const price = {
      basePrice: basePrice || product.price.basePrice,
      oneDayPremium: oneDayPremium || product.price.oneDayPremium,
      oneDayPremiumSecondItem:
        oneDayPremiumSecondItem || product.price.oneDayPremiumSecondItem,
      twoDayPremium: twoDayPremium || product.price.twoDayPremium,
      twoDayPremiumSecondItem:
        twoDayPremiumSecondItem || product.price.twoDayPremiumSecondItem,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        sku: sku || product.sku,
        discount: discount || product.discount,
        dimensions,
        price,
        mainImage,
        additionalImages,
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ message: "Product updated", updatedProduct });
  } catch (error) {
    // Log the full error for troubleshooting
    console.error("Error updating product:", error);

    // Return a more descriptive error response
    res.status(500).json({
      message: "Error updating product",
      error: error.message || "Unknown error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // const productsWithStats = await Promise.all(
    //   products.map(async (product) => {
    //     const stat = await ProductStat.find({
    //       productId: product._id,
    //     });
    //     return {
    //       ...product._doc,
    //       stat,
    //     };
    //   })
    // );

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductNames = async (req, res) => {
  try {
    const products = await Product.find({}, "id name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product names", error });
  }
};

// export const resetSaleCount = async (req, res) => {
//   try {
//     const result = await Product.updateMany({}, { $set: { saleCount: 0 } });
//     res.status(200).json({ message: `Updated ${result.nModified} products' saleCount to 0` });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating saleCount', error });
//   }
// };
