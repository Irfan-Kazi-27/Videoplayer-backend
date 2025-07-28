import { model } from "mongoose";
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema= new Schema({
    username:{
        type:String,
        required:[true,"Username is Required"],
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:[true,"email is Required"],
        unique:true,
        trim:true
    },
    fullname:{
        type:String,
        required:[true,"Fullname is Required"],
        trim:true
    },
    avatar:{
        type:String,
        required:[true,"Avatar is Required"]
    },
    coverimage:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Videos"
        }
    ],
    password:{
        type: String,
        required: [true, "Password is Required"],
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordcorrect = async function(password){
         return await bcrypt.compare(password,this.password)
}

userSchema.methods.getAccessToken =  function(){
     return  jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY 
    }
)
}


userSchema.methods.getrefreshToken =  function(){
        return jwt.sign({
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY 
 
    }
)
}

export const User = model("User",userSchema);