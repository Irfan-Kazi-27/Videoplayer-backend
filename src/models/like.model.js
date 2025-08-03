import { Schema,model } from "mongoose";

const likeSchema = new Schema({
    comment:{
        type:Schema.Types.ObjectId,
        ref:"comment"
    },
    likedby:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"tweet"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Videos"
    }
},{timestamps:true})

export const like = model("like",likeSchema)