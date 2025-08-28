import mongoose, { isValidObjectId } from "mongoose"
import {subscription} from "../models/subscription.model.js"
import {Video} from "../models/videos.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { like } from "../models/like.model.js"
import {Tweet} from "../models/tweets.model.js"
import { Comment } from "../models/comment.model.js"
import { totalmem } from "os"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

//to get channel total Subscriber 
    const owner = req.user._id
    const SubscriberCount = await subscription.countDocuments({
        channel:owner
    })    
    
//to get total Video Counts  
    const TotalVideosCount = await Video.countDocuments({
        owner
    })
    
    if (!TotalVideosCount||TotalVideosCount.length===0) {
        throw new ApiError(500,"Cannnot find Video")
    }

//to get total like on Comment
    const TotalCommentLike = await like.countDocuments({
       comment:{
            $in:await Comment.find({owner})
        }
    })
    if (TotalCommentLike==null||TotalCommentLike==undefined) {
        throw new ApiError(500,"No like On comment found"
        )
    }
//to get total like on tweet
    const Totaltweetike = await like.countDocuments({
        tweet:{
            $in:await Tweet.find({owner})
        }
    })
    if (Totaltweetike==null||Totaltweetike==undefined) {
        throw new ApiError(500,"No like On Tweet found"
        )
    }
//Total Video likes
    const TotalVideoLike = await like.countDocuments({
        video:{
            $in:await Video.find({owner}),
           
        }
        
    })
//get total views
    const TotalVideoViews = await Video.aggregate([
        {$match:{owner}},
        {
            $group:{
                _id:null,
                totalviews:{$sum:"$views"}
            }
        }
    ])
    console.log(TotalVideoViews);
    

    if (TotalVideoViews==null||TotalVideoViews==undefined) {
        throw new ApiError(500,"Cannnot Find Any View on Video")
    }

//to get total like on Video
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
            SubscriberCount,
            TotalVideosCount,
            TotalCommentLike,
            Totaltweetike,
            TotalVideoLike,
            TotalVideoViews:TotalVideoViews[0].totalviews || 0  
            },
           "Channel stats Fetched Sucessfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    //take the channel id from params
    //query for the Video of channel throughh find
    const ownerId = req.user._id

    const allChannelVideos = await Video.find(
        {
            owner:ownerId
        }
    ).sort({createdAt:-1})
    
    if (!allChannelVideos || allChannelVideos.length === 0) {
        throw new ApiError(500,"Something Went Wrong while getting Video")
    }
    
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            allChannelVideos,
            "channel Videos Fetched Sucessfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }