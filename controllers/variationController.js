import Variation from "../models/variation.js";

export const addVariation = async (req, res) => {
    try {
   
      const price = req.body.price ? JSON.parse(req.body.price) : 0;
      const xlPrice = req.body.xlPrice ? JSON.parse(req.body.xlPrice) : 0;
      const mdPrice = req.body.mdPrice ? JSON.parse(req.body.mdPrice) : 0;
  
     
  
      const mainImage = req.files && req.files["mainImage"]
        ? req.files["mainImage"][0].path
        : null;
  
      const additionalImages = req.files && req.files["additionalImages"]
        ? req.files["additionalImages"].map((file) => file.path)
        : [];

      const {
        name,
        quantity,
        productId,
        itemQty
      } = req.body;

      const newVariation = new Variation({
        name,
        quantity,
        itemQty,
        productId,
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
        const variations = await Variation.find();
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
    } ;
