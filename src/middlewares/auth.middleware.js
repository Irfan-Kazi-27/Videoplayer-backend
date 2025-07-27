import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



export const verifyJWt = asyncHandler(async (req,_,next)=>{
 try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
   
       if (!token) {
           throw new ApiError(411,"Unauthorized User")
       }
   
       const decodeInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   
       const user = await User.findById(decodeInfo?._id).select("-password -refreshToken")
   
       if (!user) {
           throw new ApiError(401,"invalid Acces Token")
       }
           req.user=user
           next()
 } catch (error) {
     throw new ApiError(401,error?.message||"invalid Acces Token")
 }
})