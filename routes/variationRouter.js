import express from "express";
import { addVariation, getVariations, getVariationsForDashobard, updateIsActive, updateOneVariation, updateVariation } from "../controllers/variationController.js";
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


  router.put('/editVariation/:id', upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 3 }
  ]),updateVariation);

router.get('/getVariations', getVariations);
router.get('/getVariationsForDashobard', getVariationsForDashobard);  

router.patch('/updateOneVariation/:id', updateOneVariation);  
router.patch('/updateIsActive/:id', updateIsActive);  

export default router;
