import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {uploadFile} from "../utils/filehandle.js";
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {generateAccestokenAndRefreshtoken} from "../utils/tokenGenerate.js"
import fs from "fs"
import jwt from "jsonwebtoken"
import { log } from 'console';
import mongoose from 'mongoose';

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
    
    


    //step2:validating the Data
    if([username,fullname,email,password,avatar].some((field)=>{field?.trim()===""})){
        throw new ApiError(400,"All Fields are Required");
    }
    if(password.length<6){
       throw new ApiError(401,"Password Must be at Least 6 Characters long");
    }
    
    if(!email.includes("@")){
        throw new ApiError(401,"Email is not Valid");
    }

     //step3: checking if the User already exists
    const userExist = await User.findOne({
        $or:[{ username },{ email }]
    })
    
    if(userExist){
        throw new ApiError(409,"User Already Exists");
    }

    //step4:check for the image and avatar
   const avatarImagepath = req.files?.avatar[0]?.path
//    const coverImagepath = req.files?.coverimage[0]?.path
    
    
   let coverImagepath;
   if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0) {
        coverImagepath = req.files.coverimage[0].path
   }
   
    
  
   

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
    const createduser =  await User.findById(user._id).select("-password -refreshToken")

    if (!createduser) {
        throw new ApiError(500,"Something Went Wrong Please try Again Later")
    }
    

     //step8:send the response
    return res.status(201).json( 
        new ApiResponse(200,user,"User Created SucessFully!")
    )

    })

const loginUser = asyncHandler(async (req,res) => {
        //user se email password lenge
        //check if the user on the basis of email ya username
        //find the user
        //check for the password is correct Or not from the password saved in the data base
        //generate refresh token and Access token
        //send a secure cookie
        //return the response
        
        
        //step 1:user se email password lenge
        const {email,password,username} =req.body
        console.log(email);
        
        
        //step 2 :check if the user on the basis of email ya username
        if (!(username || email)) {
            throw new ApiError(400,"Username or email Required")
        }

        //step 3 :find the user
        const user = await User.findOne({$or:[{password},{email}]})
        if (!user) {
            throw new ApiError(404,"User is no Register ")
        }

        //step 4 :check for the password is correct Or not from the password saved in the data base
        const passwordValid =  await user.isPasswordcorrect(password)
        if (!passwordValid) {
            throw new ApiError(401,"Password is not Correct")
        }

        const {accessToken,refreshToken} = await generateAccestokenAndRefreshtoken(user._id)

        const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

        const options = { httpOnly : true, secure:true }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
             new ApiResponse(
                200,
                {user:loggedInuser,accessToken,refreshToken},
                "User LoggedIn sucessfully"
            )

        )
    })

const logout = asyncHandler(async (req,res)=>{
          await  User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken : undefined
                },
            },
            {
                    new : true
            }
        )

        const options = { httpOnly : true, secure:true }
        return res
        .status(200)
        .cookie("accessToken",options)
        .cookie("refreshToken",options)
        .json(
             new ApiResponse(
                200,
                {},
                "User Loggedout sucessfully"
            )

        )

    })

const AccesTokenRefresh = asyncHandler(async(req,res)=>{
        //get the refresh token from the user may be from cookie or body
        const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
        console.log(incomingRefreshToken);
        
        //check if the token is recieved
        if (!incomingRefreshToken) {
            throw new ApiError(401,"Unauothorized User")
        }

        try {
            //wee need to verify the refresh token
            const decodedtoken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
    
            //retrive the User Info through the decodedtoken
            const user = await User.findById(decodedtoken?._id)
    
            if (!user) {
                throw new ApiError(404,"Invalid refresh token")
            }
    
    
            if (incomingRefreshToken !== user?.refreshToken) {
                throw new ApiError(401,"Refresh Token is expired or used ")
            }
    
            //if the access token match from the decoded generate new tokens and send it through response
            const {accessToken,newRefreshToken} = await generateAccestokenAndRefreshtoken(user?._id)
    
            const options = {
                httpOnly : true,
                secure:true
            }
    
           return res.status(200)
            .cookie("AccessToken",accessToken,options)
            .cookie("RefreshToken",newRefreshToken,options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,refreshToken:newRefreshToken
                    },
                    "Access Token refreshed"
                )
            )
        } catch (error) {
            throw new ApiError(401,error?.message || "Invalid refresh Token")
        }





    })

const changeUserPassword = asyncHandler(async(req,res)=>{
        //taking Old password and new password from req.body
        const {oldPassword,newPassword} = req.body

        //getting Out the user Information
        const user = await User.findById( req.user?._id)

        if (!user) {
            throw new ApiError(400,"You are not LoggedIn")
        }

        //Check for the Old password Is correct Or Not
        const isPasswordcorrect =  await user.isPasswordcorrect(oldPassword)
        if (!isPasswordcorrect) {
            throw new ApiError(400,"Your Password is Invalid")
        }

         user.password = newPassword
         await user.save({validateBeforeSave:true})

        return res.status(200)
         .json(
            new ApiResponse(
                200,
                {},
                "Password Changed SucessFully"

            )
         )

    })

const getCurrentUserProfile = asyncHandler(async(req,res)=>{
       return res.status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "User Fetched SucessFully"
            )
        )
    })

const updateUserDetail = asyncHandler(async(req,res)=>{
        const {fullname,email} = req.body

        if (!(fullname || email)) {
            throw new ApiError(410,"Both the field is Required")
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    fullname,
                    email
                }

            },{
                new:true
            }.select("-password")
        )

       return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Fullname Or Email Update Succesfully"
            )
        )

    })

const updateUserAvatar = asyncHandler(async(req,res)=>{
    //taking the avatar localfile path from req.body
    const avatarLocalpath = req.file?.path
    if (!avatarLocalpath) {
        throw new ApiError(404,"Avatar file is Missing")
    }

    const newAvatarFile = await uploadFile(avatarLocalpath)

    if (!newAvatarFile.url) {
        throw new ApiError(400,"File not Uploaded On Cloudinary")
    }

    const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:newAvatarFile.url  
            }
        },
        {new:true}
    ).select("-password")

     //delete Old Avatar File 
    const deleteOldAvatarfile = fs.unlinkSync(avatarLocalpath)
    if (deleteOldAvatarfile) {
        throw new ApiError(400,"Old file is not deleted")
    }
    

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Avatar Update Succesfully"
        )
    )

    })

const updateUserCoverImage = asyncHandler(async(req,res)=>{
      
    const coverImageLocalpath = req.file?.path
    if (!coverImageLocalpath) {
        throw new ApiError(404,"Cover Image file is Missing")
    }

    const newCoverImageFile = await uploadFile(avatarLocalpath)

    if (!newCoverImageFile.url) {
        throw new ApiError(400,"File not Uploaded On Cloudinary")
    }

    const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage:newCoverImageFile.url  
            }
        },
        {new:true}
    ).select("-password")

    //delete Old cover Image File 
    const deleteOldCoverImagefile = fs.unlinkSync(coverImageLocalpath)
    if (deleteOldCoverImagefile) {
        throw new ApiError(400,"Old file is not deleted")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "CoverImage Update Succesfully"
        )
    )

    })

const getUserProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params

    if (!username) {
        throw new ApiError(400,"UserName is Missing")
    }

const channelInfo  =  await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"Subscriber"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"SubscribedTo"
            }
        },
        {
            $addFields:{
                SubscriberCount:{
                    $size:"$Subscriber"
                },
                channelSubscribedTo:{
                    $size:"$SubscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$Subscriber.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                username:1,
                SubscriberCount:1,
                channelSubscribedTo:1,
                isSubscribed:1,
                email:1,
                coverimage:1,
                avatar:1
            }
        }

    ])

    if (!channelInfo.length) {
        throw new ApiError(400,"Channel does not exists")
    }
    console.log(channelInfo);
    

    return res.json(new ApiResponse(
        200,
        channelInfo[0],
        "User Channel Info Fetched Successfully "

    ))
})

const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId.createFromHexString(req.user._id) 
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        fullname:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                        
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History Fetched Sucessfully"
    ))
})



export { registerUser
        ,loginUser
        ,logout
        ,AccesTokenRefresh
        ,changeUserPassword
        ,getCurrentUserProfile
        ,updateUserDetail
        ,updateUserAvatar
        ,updateUserCoverImage 
        ,getUserProfile
        ,getWatchHistory 
    };