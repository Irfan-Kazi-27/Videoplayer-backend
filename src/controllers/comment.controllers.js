import {User} from "../models/user.model.js"
import {Video} from "../models/videos.model.js"
import {Comment} from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"
import { response } from "express"


const addComment = asyncHandler(async (req, res) => {
// TODO: add a comment to a video
    const {videoId} = req.params

    
//Verify the Correct Video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid Video Id")
    }

//get the user Id to Know Which User is Commenting
    const owner = await User.findById(req.user._id).select("username email")
//find the Video on Which the user Commented
  
    
//check for the User Only Loggedin User Can comment
    if (!owner) {
        throw new ApiError(400,"Unauthorized User Please Logged In first")
    }
//get the Comment From the request Body
    const {content} = req.body
    if (!content) {
        throw new ApiError(404,"Empty or Null Fields are In valid")
    }

//Create the Comment 
    const comment =await Comment.create({
        content,
        videoId,
        owner
    })
    
// return The response 

return res
.status(200)
.json(
    new ApiResponse(
        200,
        comment,
        "comment Succesfully"
    )
)
    


})

const getVideoComments = asyncHandler(async (req, res) => {
//TODO: get all comments for a video
//Get the Video Id from request paramters
    const {videoId} = req.params    
    const {page = 1, limit = 10} = req.query 
   


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
// get the video Id from the request parameter
    const {commentId} = req.params
    const comment = await Comment.findById(commentId)

//Take the New Comment From the User
    const {newComment} = req.body

    
//check for if the Comment ID is vaid MongoDB Object Id
    if (!isValidObjectId(commentId)) {
        throw new ApiError(401,"Invalid Comment Id")
    }
//check for Only verify User Can Update Comment
        const owner = req.user._id
        if (!owner) {
            throw new ApiError(401,"Logged In first")
        } 
//check for the User Updating their Comment Only
        if (owner.toString() !== comment.owner._id.toString()) {
            throw new ApiError(400,"You can update only your Comment")
        }
//update the Comment By Using findByIdAndUpdate
        const UpdatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set:{
                    content:newComment
                }
            },
            {
                new:true
            }
        ).select("owner video content")
        console.log(UpdatedComment);
        

// return the Response and the Data
        return res
        .status(200)
        .json(
            new ApiResponse(200,
                UpdatedComment,
                "Comment Updated Succesfully"
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
//get the Comment Id from request parameter    
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(200,"Invalid Comment Id")
    }
//find the Comment through Comment Id
    const deleteComment = await Comment.findByIdAndDelete(
        commentId
    )
    if (!deleteComment) {
        throw new ApiError(500,"Comment Not Deleted")
    }
//Return the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            [],
            "Comment Deleted Succesfully"
        )
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }