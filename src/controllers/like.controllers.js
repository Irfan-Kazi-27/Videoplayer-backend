import { ApiError  } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { like } from "../models/like.model.js"
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
//TODO: toggle like on video
//check krna hai ki video is liked or not
//if not create like if liked unlike Using delete


    const {videoId} = req.params
    const User = req.user._id
    //check for if the videoId is valid Mongoose Id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid video id")
    }
//check for the User Already Liked Video or not
    const existingUserLike = await like.findOne(
        {video:videoId,
         likedby:User   
        }
    )
    if (existingUserLike) {
        //unlike the video
        const unlikeVideo = await like.findByIdAndDelete(existingUserLike._id)
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                unlikeVideo,
                "unlike video Successfully"
            )
        )
    }
//if existingUser is not their then create a like
    const likedVideo = await like.create(
        {
            video:videoId,
            likedby:req.user._id
        }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            likedVideo,
            "Liked video Successfully"
        )
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
 //TODO: toggle like on comment
 //Same toggle Logic as like Logic
 //first we check for if the comment is liked
 //if the comment is liked we unliked it and if not we create it
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400,"Invalid comment id")
    }
    const User = req.user._id
    const existingCommentLike = await like.findOne(
        {
            comment:commentId,
            likedby:User
        }
    )
    if (existingCommentLike) {
        const unlikeComment = await like.findByIdAndDelete(existingCommentLike._id)
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                unlikeComment,
                "Unlike Comment Successfully"
            )
        )
    }

    const likedComment = await like.create(
        {
            comment:commentId,
            likedby:User
        }
    )
    
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            likedComment,
            "Comment Liked Successfully"
        )
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
//TODO: toggle like on tweet
//same Logic 
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400,"Invalid Tweet id")
    }
    const User = req.user._id

    const existingTweetLike = await like.findOne(
        {
            tweet:tweetId,
            likedby:User
        }
    )

    if (existingTweetLike) {
        const unlikeTweet = await like.findByIdAndDelete(existingTweetLike._id)
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                unlikeTweet,
                "Unlike Tweet Successfully"
            )
        )
    }

    const likeTweet = await like.create(
        {
            tweet:tweetId,
            likedby:User
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            likeTweet,
            "Liked Tweet Successfully"
        )
    )
    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
//TODO: get all liked 
//get all the thing which a particular user like [tweet,video,comment]
//usmai se video jo hai vo nikalna hai
    const User = req.user._id
    // const allLikedVideo = await like.aggregate([
    //     {
    //         $match:{likedby:User}
    //     },
    //     {
            
    //     }
    // ])
    const allLikedVideo = await like.find(
        {
            likedby:User,
            video:{$exists:true}
        }

    )
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            allLikedVideo,
            "All liked Video Fetched Successfully"
        )
    )
    
    

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}