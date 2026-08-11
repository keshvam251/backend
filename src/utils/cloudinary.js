import cloudinary from "cloudinary"
import fs from "fs"

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    })
const uploadCloudinary=async(LocalFilePath)=>{
    try {
        if(!LocalFilePath) return null 
       const response = await cloudinary.uploader.upload(LocalFilePath,{
            resource_type:"auto"
        })
        // file has succesfully uploaded
        console.log("file is uploaded succesfully on cloudinary",response.url);
        return response;
    } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadCloudinary}