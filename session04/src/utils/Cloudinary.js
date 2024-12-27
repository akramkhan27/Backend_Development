import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// why i added i also don't know but after adding again dotenv 
// cloudinary config can happen either cloudinary cannot retrieve
// data from dotenv file 

import dotenv from "dotenv"
dotenv.config()

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const uploadOnCloudinary= async (localeFilePath)=>{
    try{
        // console.log(localeFilePath);
        
        if(!localeFilePath) return null
        // upload the file on cloudinary
        const response= await cloudinary.uploader.upload(localeFilePath,{
            resource_type: "auto"
        })

        // file uploaded successfully
        console.log("File uploaded on cloudinary successfully ",response.url);
        fs.unlinkSync(localeFilePath)
        return response;
    }
    catch(Error){
        // remove locally available file when upload operation failed
        fs.unlinkSync(localeFilePath)
        console.log(Error);
        return null
    }
}

export {uploadOnCloudinary}