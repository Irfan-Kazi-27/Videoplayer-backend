import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweets.model.js"
import  {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    //steps for Creating tweets
    
    //fetching tweet from req.body
    const { content } = req.body
    if (!content) {
        throw new ApiError(400,"Please Share Your tweet With Us")
    }
    //fetching owner 
    const owner = await User.findById(req.user._id,)
    
    if (!owner) {
        throw new ApiError(400,"Error While getting User")
    }
    
    
  
    //adding to the data base
    const usertweet = await Tweet.create({
        content,
        owner
    })
    
    
    // //returning the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            usertweet,
            "Tweeted Succesfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
//steps to get Users Tweet

//get the Userid from the requested User
    const userId = req.user._id

//check for the User Id
    if (!userId) {
        throw new ApiError(400,"Please Login First")
    }
//get the User Tweet By find() method 
    const usersTweet = await Tweet.find(
        {owner:userId},
        {content:1}
    )
    

//return All the Tweets Tweeted By A single User
    return res
    .status(200)
    .json(
        new ApiResponse(

            200,
            usersTweet,
            "User Tweets Fetched Succesfully"

        )
    )
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
//Receive the Tweet ID and new data (owner and content) from the request.
    //tweet id from request parameters
        const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(403,"Invalid Object Id")
    }
    // Get the User Id from the Request
    const userId = req.user._id
    
    //get the new Tweet
    const {newContent} = req.body


    // //find the tweet from the tweetId
    const oldTweet = await Tweet.findById(tweetId)
    //check for there is any oldtweeet
    if (!oldTweet) {
        throw new ApiError(403,"There is no Tweet on this id")
    }
    //check for the user can only update their tweets
    if (oldTweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403,"You can update Only Your Tweets")
    }

    // Use findByIdAndUpdate() to find the tweet by its ID.
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:newContent
            }
        },
        {
            new:true
        }
    )
   

    
    
    return res
    .status(200) 
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "Your Tweet Updated Succesfully"
        )
    )   
})  

const deleteTweet = asyncHandler(async (req, res) => {
//TODO: delete tweet
//taking tweet Id from request parameters
    const {tweetId} = req.params

//fetching the UserId from request body
    const userId = req.user._id

//checking for the valid Object ID
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400,"Invalid Object Id")
    }

// fetching the tweet which User want to delete to check the owner id and user id
    const tweet =await Tweet.findById(tweetId)
    console.log(tweet);
    
    
    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(404,"You can only delete Your tweets")
    }

//delete the tweet    
    const tweetDelete = await Tweet.findByIdAndDelete(tweetId)
    
    if (!tweetDelete) {
        throw new ApiError(500,"Something went Wrong While deleting tweet")
    }

//return the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "tweet Deleted Succesfully"

        )
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}