import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customerError.js";
import User from "../models/userModel.js";

const protect=asyncErrorHandler(async(req,res,next)=>{
    const token=req.cookies.token;
  
    if(!token){
        const error = new CustomError("Not authorized please login", 404);
        return next(error);
    }
    const verfied=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(verfied.id).select("-password");
    req.user=user
    next();
})

export{protect};