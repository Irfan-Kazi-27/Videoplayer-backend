import mongoose,{model,Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videofile:{
        type:String,
        required:[true,"Video file is required"],
    },
    thumbnail:{
        type:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Owner is required"]
    },
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true,
        index:true
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        trim:true
    },
    duration:{
        type:Number
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

videoSchema.plugin(aggregatePaginate);

export const Video = model("Video",videoSchema)