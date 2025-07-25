import {v2 as cloudinary} from "cloudinary"
import { log } from "console";
import fs from "fs"
//configuring cloudinary with environment variables
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.SECRET_KEY
});



const uploadFile = async (localfilePath)=>{
      try{
        if(!localfilePath) return "file path is not received";
        //uploading file to cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto",
        });
          fs.unlinkSync(localfilePath);
          return response;
      }catch(err){
        fs.unlinkSync(localfilePath);
        return null // Delete the file if upload fails
      } 
}



export {uploadFile};