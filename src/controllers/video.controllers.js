import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/videos.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadFile} from "../utils/filehandle.js"




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
     const uploadthumbnailOnCloudinary = await uploadFile(thumbnailpath)
     console.log(uploadVideoOnCloudinary);
     
     
 
     if (!uploadVideoOnCloudinary) {
         throw new ApiError(404,"Video Not Uploaded On Cloudinary")
     }
 //create Video Document On the MongoDB
     const video = await Video.create({
         title,
         thumbnail:uploadthumbnailOnCloudinary.url,
         description,
         videofile:uploadVideoOnCloudinary.url,
         owner,
         duration:uploadVideoOnCloudinary.duration
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
//TODO: get video by id
    const { videoId } = req.params
    //check for the video Id is a valid Mongoose Object Id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid Object Id")
    }
/* If the video id is correct Mongoose Object Id then it will find the Video */
    const video = await Video.findById(videoId).select("videofile")
/*Now return the response and return only url of video */
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video Fetched Succesfully"
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
 //TODO: update video details like title, description, thumbnail

 //To Update the Video Details takeing the Video Id from parameters   
    const { videoId } = req.params
    //check for the Id we get is valid Mongoose Id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid Video Id")
    }

    //get th User Id from the requested user
    const ownerId = req.user._id 
    //check For the User id is their
    if (!ownerId) {
        throw new ApiError(400,"Please Logged In first")
    }

    //get the new Title,description,thumbnail from the request Body
    const { title, description } = req.body

    //get the New thumbnail from the request file
    const newThumbnailPath = req.file.path
    console.log(req.file);
    
    
    //now check for if user want to just update one thing or two things of their video
    if (!( title || description || newThumbnailPath)) {
        throw new ApiError(400,"atleast one thing is required To update The video Detail")
    }
/*Upload the new thumbnail to the Cloudinary*/ 
    const newThumbnail = await uploadFile(newThumbnailPath)
    // console.log(newThumbnail);
    

/*now find the video by id and check for the requested User is the owner if he/she is the owner only then 
 can Update the User Details*/
    const oldvideo = await Video.findById(videoId)
    // console.log(oldvideo);
    
    if (oldvideo.owner._id.toString() !== ownerId.toString() ) {
        throw new ApiError(40,"You can only Your Videos")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        
        {
            $set:{
                thumbnail:newThumbnail.url,
                title,
                description
            }
        },
        {
            new:true
        }
        
    )
    //check if the video is updateded Or now 
    if (!updatedVideo) {
        throw new ApiError(500,"Video not Updated Something went Wrong")
    }

/*If Every Thing is Fine return the response */
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedVideo,
            "Video Updated Succesfully"
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
 //TODO: delete video
//Get the Video id to delete Video From Video Parameters  
    const { videoId } = req.params
    //check for the video Id is the valid mongoose Id 
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400,"Invalid Video Id")
        }
//Get the User id from the Requested User
    const ownerId = req.user._id
    //check for the User is Logged In or Not
    if (!ownerId) {
        throw new ApiError(400,"Please Logged In first")
    }
//check For the User deleting their Video Only
   //first find the Video Detail based on the Video Id
   const video = await Video.findById(videoId)
   //now check for the User who post the video only they can delete the Video
   if (video.owner._id.toString() !== ownerId.toString() ) {
        throw new ApiError(401,"You can Only delete Your Videos")
   }
//Now Find the Video By Id Using findByIdAndDelete and delete
   const deletingVideo = await Video.findByIdAndDelete(videoId)
   //check for the video is deleted Or Not
   if (!deletingVideo) {
        throw new ApiError(500,"Video is not delete Something went Wrong")
    }
  
//return The response 
   // In this response we will return The data Which when we Fetched the Video and all video details
   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        [],
        "Video Deleted Succesfully"
    )
   )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid Object Id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404,"video not Found")
    }

    video.isPublished = !video.isPublished
    await video.save()
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Fetched video is Published Or not"
        )
    )
    
    
    
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}