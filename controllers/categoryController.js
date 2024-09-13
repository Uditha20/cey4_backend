import Category from "../models/category.js";

export const createCategory = async (req, res) => {
  const { name,description } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });  
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = new Category({ name,description });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}



export const getCategories = async (req, res) => {  
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
} 
export const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}