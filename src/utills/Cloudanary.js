import { v2 as cloudinary } from "cloudinary"; 
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUD_URL, 
    api_key: process.env.CLOUD_API,    
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

const uploadFileCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("File uploaded successfully", response.url);
        // Delete the local file after successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;
    } catch (error) {
        // Only attempt to delete if file exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        // Re-throw the error to be handled by the caller
        throw error;
    }
}

export default uploadFileCloudinary;