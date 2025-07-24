import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {uploadFile} from "../utils/filehandle.js";
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req,res)=>{
    //writing logic of registring User
    //step1 : getting data from request Body
    //step2:validating the Data
    //step3: checking if the User already exists
    //step4:check for the image and avatar
    //step5:upload them to the cloudniary
    //step6:creating a user Object
    //step7:removing the pass and refresh token from the response
    //step8:send the response


    //step1 : getting data from request Body
    const {username,fullname,email,password,avatar,coverimage}=req.body;
    console.log("Email:",email)


    //step2:validating the Data
    if([username,fullname,email,password,avtar].some((field)=>{field?.trim()===""})){
        throw new ApiError(400,"All Fields are Required");
    }
    if(password.length<6){
       throw new ApiError(401,"Password Must be at Least 6 Characters long");
    }
    
    if(!email.includes("@")){
        throw new ApiError(401,"Email is not Valid");
    }

     //step3: checking if the User already exists
    const userExist = User.findOne({
        $or:[{ username },{ email }]
    })
    
    if(userExist){
        throw new ApiError(409,"User Already Exists");
    }

    //step4:check for the image and avatar
   const avatarImagepath = req.files?.avatar[0]?.path
   const coverImagepath = req.files?.coverimage[0]?.path

   if(!avatarImagepath){
      throw new ApiError(410,"Avatar Image is not Found")
   }

   //step5:upload them to the cloudniary
    const avatarCloudUpload = await uploadFile(avatarImagepath);
    const coverImageCloudUpload = await uploadFile(coverImagepath);

   if (!avatarCloudUpload) {
        throw new ApiError(411,"Image Not Uploaded")
   }


   //step6:creating a user Object
    const user = await User.create({
     username: username.toLowerCase(),
     fullname,
     email,
     avatar : avatarCloudUpload.url ,
     coverimage : coverImageCloudUpload.url || "",
     password
    })
    

     //step7:removing the pass and refresh token from the response
    const createduser =  await User.findById(userCreated._id).select("-password -refreshToken")

    if (!createduser) {
        throw new ApiError(500,"Something Went Wrong Please try Again Later")
    }
    

     //step8:send the response
    return res.status(201).json( 
        new ApiResponse(200,user,"User Created SucessFully!")
    )

    })

export {registerUser};