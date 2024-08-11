import { Router } from "express";
import { createOrder, getAllOrders, getOrderById, paymentSession} from "../controllers/orderController.js";
const router = Router();
// Create a new order
router.post('/orders',createOrder);
router.post('/payment',paymentSession);
router.get('/orderHistory',getAllOrders);
router.get('/getoneorder/:orderId',getOrderById)


export default router


