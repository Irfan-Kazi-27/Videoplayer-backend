import {User} from "../models/user.model.js"
import { ApiError } from "./ApiError.js"

export const generateAccestokenAndRefreshtoken = async(user_id)=>{
    try {
        const user = await User.findById(user_id)
        const accessToken =  user.getAccessToken()
        const refreshToken=  user.getrefreshToken()
    
        user.refreshToken = refreshToken
        user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,error||"Something went Wrong While Creating the tokens")
    }
}