import { Router } from "express";
import { createOrder, paymentSession} from "../controllers/orderController.js";
const router = Router();
// Create a new order
router.post('/orders',createOrder);
router.post('/payment',paymentSession);


export default router


