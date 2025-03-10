import express from "express";
import { createDeliveryCost, getDeliveryCost, getSales } from "../controllers/sales.js";
import { createCategory, getCategories, updateCategoryStatus } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/sales", getSales);
router.post("/addCost",createDeliveryCost);
router.get("/getCost",getDeliveryCost);
router.post("/category",createCategory);
router.get("/getCategories",getCategories);
router.put("/updateCategory/:id",updateCategoryStatus)
export default router;
