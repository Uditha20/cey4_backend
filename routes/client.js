import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  addProduct,
  updateProduct,
  getProductNames,
  updateProducts,
  updateOneProduct,
  deleteProduct,
  getProductsForDashboard,
  getActiveProductCount,
  getProductById,
} from "../controllers/client.js";

import multer from "multer";

import { addVariation } from "../controllers/variationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/products", getProducts);
router.get("/dashboard/products",verifyToken,getProducts);
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
  { name: "additionalImages", maxCount: 10 },
]), addProduct);

router.put('/products/:id', upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 }
]), updateProduct);


router.post('/createVariation', upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 10 },
]), addVariation);


router.get('/productsName',getProductNames);
router.get('/products', getProducts); 
router.get('/dashboardProducts',getProductsForDashboard);
router.patch('/update-product', updateProducts);
router.patch('/updateOneProduct/:id', updateOneProduct);
router.patch('/deleteOneProduct/:id', deleteProduct);
router.get('/prodictcount',getActiveProductCount)
router.get('/products/:id', getProductById);




// router.post('/reset-sale-count', resetSaleCount);
export default router;
