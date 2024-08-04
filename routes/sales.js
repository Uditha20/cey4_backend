import express from "express";
import { createDeliveryCost, getDeliveryCost, getSales } from "../controllers/sales.js";

const router = express.Router();

router.get("/sales", getSales);
router.post("/addCost",createDeliveryCost);
router.get("/getCost",getDeliveryCost)
export default router;
