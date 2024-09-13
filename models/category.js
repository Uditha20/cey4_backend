import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 100,
    },
    description: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
  

});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
