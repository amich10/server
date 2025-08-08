import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloduinarConfig } from "../config/config";


cloudinary.config({
    cloud_name:cloduinarConfig.cloudName,
    api_key:cloduinarConfig.apiKey,
    api_secret:cloduinarConfig.apiSecret
})


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: async(req,file) =>({
        folder:"saas"
    })
})

export {cloudinary,storage}