import { Router } from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUserProfile,
  verifyEmail,
} from "../controllers/useController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

import { createCategory } from "../controllers/categoryController.js";
import { verify } from "crypto";

const router = Router();

router.route("/register").post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/getUserProfile",verifyToken, getUserProfile);
router.put("/update/:id", updateUserProfile);

export default router;


