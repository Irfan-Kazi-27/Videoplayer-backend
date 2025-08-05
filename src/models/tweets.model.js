import mongoose,{Schema,model} from "mongoose";

const tweetSchema = new Schema ({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"videos"
    },
    content:{
        type:String,
        required:[true,"Content is required"],  
        index:true
    }
},{timestamps:true})


export const Tweet = model("Tweet",tweetSchema)