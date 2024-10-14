import express from "express";
import { addVariation, getVariations } from "../controllers/variationController.js";
import multer from "multer";
const router=express.Router();  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/createVariation', upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 3 },
  ]), addVariation);

router.get('/getVariations', getVariations);

export default router;
