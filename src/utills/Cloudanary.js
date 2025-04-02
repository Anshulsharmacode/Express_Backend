import { v2 as cloudinary } from "cloudinary"; 
import fs from "fs";
cloudinary.config({ 
    cloud_name:process.env.CLOUD_URL, 
    api_key: process.env.CLOUD_API,    
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadFileCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("File uploaded successfully", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
    
}
export default uploadFileCloudinary;