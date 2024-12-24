import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const uploadOnClouadinary= async (localeFilePath)=>{
    try{
        if(!localeFilePath) return null;
        // upload the file on cloudinary
        const response= await cloudinary.uploader.upload(localeFilePath,{
            resource_type: "auto"
        })

        // file uploaded successfully
        console.log("File uploaded on cloudinary successfully ",response.url);
    }
    catch(Error){
        fs.unlinkSync(localeFilePath)
        // remove localally available file when upload operation failed
        return null
    }
}

export {uploadOnClouadinary}