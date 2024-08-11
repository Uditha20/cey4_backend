import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  addProduct,
} from "../controllers/client.js";

import multer from "multer";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/products", getProducts);
router.get("/dashboard/products",protect,getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/products', upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 3 },
]), addProduct);


// router.post('/reset-sale-count', resetSaleCount);
export default router;
