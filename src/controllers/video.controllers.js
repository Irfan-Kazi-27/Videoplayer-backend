import mongoose from "mongoose"
import { Video } from "../models/videos.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadFile} from "../utils/filehandle.js"
import fs from "fs"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    //
})

const publishAVideo = asyncHandler(async (req, res) => {
// TODO: get video, upload to cloudinary, create video
//Get the title And thumbnail From the request body  
    const { title, description,videofile,thumbnail } = req.body
//get the Owner from the requested User
    const owner = req.user._id
    if (!owner) {
        throw new ApiError(400,"Please LoggedIn first")
    }
    
//get the File Path From the request file
  
     const videofilepath = req.files?.videofile[0].path
     const thumbnailpath = req.files?.thumbnail[0].path
     
     if (!(videofilepath && thumbnailpath)) {
         throw new ApiError(400,"Error while taking File")
     }
     
//check for all the necessary Details are available 
     if (!(title && description && videofilepath)) {
     throw new ApiError(400,"Give Proper title,description and video File ")
     }
 //upload Video On Cloudinary
     const uploadVideoOnCloudinary = await uploadFile(videofilepath)
     const uploadthumbnailOnCloudinary = await uploadFile(thumbnail)
 
     if (!uploadVideoOnCloudinary) {
         throw new ApiError(404,"Video Not Uploaded On Cloudinary")
     }
 //create Video Document On the MongoDB
     const video = await Video.create({
         title,
         thumbnail:uploadthumbnailOnCloudinary.url,
         description,
         videofile:uploadVideoOnCloudinary.url,
         owner
     })
 
     if (!video) {
         throw new ApiError(400,"Something went Wrong While upload on Database")
     }
 
     return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             video,
             "Video Published SucessFully"
         )
     )
   

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}