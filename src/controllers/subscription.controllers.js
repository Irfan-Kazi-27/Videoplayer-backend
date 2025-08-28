import { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { subscription } from "../models/subscription.model.js"




const toggleSubscription = asyncHandler(async (req, res) => {
//toggleSubscription
    const {channelId} = req.params
//check if the channel Id is valid Mongoose _id
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400,"Invalid channel Id")
    }
    const  subscriberId = req.user._id
    console.log(subscriberId);
    
    
//check for User cannot suscribe Their own channel
    if (channelId.toString() == subscriberId.toString()) {
        throw new ApiError(400,"You cannot suscribe Your Channel")
    }

//check if the User already subscribe the Channel 
    const alreadySubscribed = await subscription.findOne(
        {
            subscriber:subscriberId,
            channel:channelId
        }
    )
    
//if the User already subscribe then find it and delete
    if (alreadySubscribed) {
        const unSubscribe = await subscription.findByIdAndDelete(alreadySubscribed._id)
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                unSubscribe,
                "Unsubscribed Sucessfully"
            )
        )
    }
    
//if user not subscribe then Create a new subscriber not the channel
    const newSubscribe = await subscription.create(
        {
            subscriber:subscriberId,
            channel:channelId
        }
    )   
   
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            newSubscribe,
            "Subscribed Sucessfully"
        )
    )


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400,"Invalid Object id")
    } 
//to fetched User subscriber the following steps are Their
//we have to count the subscriber of the channel
    const subscriber = await subscription.find(
        {
            channel:channelId
        }
    ).populate("subscriber","fullname _id email")
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            subscriber,
            "Subscriber fetched Sucessfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400,"Invalid Object id")
    }   
//to fetched User Subscribed how many Channel the following steps are Their
//we have to count the subscriber How many channel User subscribed of the channel

    const UserSubscribedChannelCount = await subscription.find(
        {
            subscriber:subscriberId
        }
    ).populate("channel","username _id email")

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            UserSubscribedChannelCount,
            "fetched Subscribed channel Count Sucessfully"
        )
    )
    


})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}