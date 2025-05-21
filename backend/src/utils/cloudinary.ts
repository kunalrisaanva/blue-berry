import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";



cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploader = async (localPath: string): Promise<string> => {
  try {
    if (!localPath) throw new Error("No file path provided");

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
      public_id: "user_cover_image"
    });

    fs.unlinkSync(localPath); // delete local file after upload

    return response.secure_url; 
  } catch (error) {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    console.error("ERROR WHILE UPLOADING IMAGE TO CLOUDINARY:", error);
    throw error; 
  }
};

export { cloudinaryUploader };
