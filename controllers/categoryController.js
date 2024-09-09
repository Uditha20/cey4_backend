import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });  
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}