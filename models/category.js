import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 100,
    }
  

});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
