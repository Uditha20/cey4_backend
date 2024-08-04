import { Router } from "express";
import { createOrder} from "../controllers/orderController.js";
const router = Router();
// Create a new order
router.post('/orders',createOrder);


export default router


