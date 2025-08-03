import { Schema,model } from "mongoose";

const playlistSchema = new Schema({
    name:{
        type:String,
        required:true,
        index:true
    },
    description:{
        type:String,
        required:true,
    },
    videos:[
        {
           type:Schema.Types.ObjectId,
           ref:"Videos" 
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const playlist = model("playlist",playlistSchema)