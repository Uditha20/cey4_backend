import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/useController.js";

const router = Router();

router.route("/register").post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);


export default router;


