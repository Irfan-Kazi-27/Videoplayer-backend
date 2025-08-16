import {  ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { playlist } from "../models/playlist.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
import { Video } from "../models/videos.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
//Logic to build playlist
//TODO: create playlist
//taking the name description from the request body
//taking the owner id from the requested User
//For now we are just Creating the PlayList so we are not just adding video in it an empty playlist
//Create the playlist Document using model.create()
//return the response 

//step 01 :- Taking the name and description of playlist from request body
    const {name, description} = req.body
    //check that request body is not empty
    if (!(name && description)) {
        throw new ApiError(400,"Give tha name and Description to the PlayList")
    }
//step 02 :- Taking the owner Id from the requested User
    const owner=  req.user._id
    //check for the owner Id is their or not
    if (!owner) {
        throw new ApiError(400,"Logged in first")
    }
//step 03 :- we are not adding any video we are just creating a PlayList
//step 04 :- now Create the playlist Document using model.create
    const createdPlaylist = await playlist.create({
        name,
        description,
        owner
    })
    if (!createdPlaylist) {
        throw new ApiError(500,"Error While Creating Playlist")
    }
//Step 05 :- Return the Response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdPlaylist,
            "PlayList Created Succesfully"
        )
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
//TODO: get user playlists
//taking user Id from request parameter 
//check for valid User id
//find the playlist by user id
//return the Response
    
 //step 01 :- taking user Id from request parameter   
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(402,"Invalid user name")
    }
//step 02 :- find the playlist by user id
    const userPlaylist = await playlist.find(
        {
            owner:userId
        }
    )
        
    if (!userPlaylist) {
        throw new ApiError(404,"playlist not Found")
    }
//step 03 :- return the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userPlaylist,
            "User PlayList by User id fetched Succesfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
 //TODO: get playlist by id  
 //get the playlist id from request parameters 
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"Invalid playlist Id")
    }
//find the playlist by playlistid 
    const playlistById = await playlist.findById(playlistId)
    if (!playlistById) {
        throw new ApiError(504,"something went wrong")
    }
//return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlistById,
            "playlist fetched Succesfully"
        )
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
// get the Video id to add a video and PlayList id in which playlist to add the video
    const {playlistId, videoId} = req.params
    //check for the both id is valid isValidObjectId 
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid playlist id")
    }

    
   
//find the playlistById and add the video
    const addedVideoToPlaylist = await playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videoId } }, // $addToSet prevents duplicates
    { new: true }
);
    
    if (!addedVideoToPlaylist) {
        throw new ApiError(500,"There is a problem in adding video")
    }
//return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            addedVideoToPlaylist,
            "Added video to Playlist Succesfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
 // TODO: remove video from playlist
    const {playlistId, videoId} = req.params
//check For the Video id and PlayList Id is valid mongoose Id
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid playlist or video Id")
    }

//only owner can remove the 
    const videoDeletingOwner = req.user._id
    const PlaylistOwner = await playlist.findById(playlistId) 

//check video Deleting owner and PlaylistOwner are same
    if (PlaylistOwner.owner.toString() !== videoDeletingOwner.toString()) {
        throw new ApiError(403,"You can Only delete or add Video to your playlist")
    }

//delete the video from the PlayList
    const playlistAfterRemovingVideo = await playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{videos:videoId}//remove the video 
        },
        {
            new:true
        }
    )
//return the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlistAfterRemovingVideo,
            "Remove Video in from the PlayList Succesfully"
        )
    )

   

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
//check if the playlist id is valid Mongoose Id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"Invalid Mongoose Id")
    }
//find the playlist by its id and delete it
    const deletedplaylist = await playlist.findByIdAndDelete(playlistId)
    if (!deletedplaylist) {
        throw new ApiError(500,"Deleting playlist went Wrong")
    }
//return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            [],
            "playlist deleted Succesfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
//check if the playlistid is valid Mogodb object id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400,"Invalid playlist id")
    }
//check for the req.body give properly
    if (!(name || description)) {
        throw new ApiError(400,"Name or description required")
    }
//get the owner id to check playlist owner can only update 
    const changingOwner = req.user._id
    const Playlist = await playlist.findById(playlistId)
   
    if (Playlist.owner.toString() !== changingOwner.toString()) {
        throw new ApiError(400,"You can only change Your PlayList")
    }

//if get all the detail then change according to that detail
    const updatedPlaylist = await playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description
            }
        },
        {
            new:true
        }
    )
//now All things done return the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "PlayList Updated Succesfully"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}