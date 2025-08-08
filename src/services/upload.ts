import multer from "multer";
import { storage } from "./cloudinary.config";
import { Request } from "express";

const upload = multer({
    storage:storage,
    fileFilter:(req:Request,file:Express.Multer.File,cb) =>{
        const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"]
        if(allowedFileTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error("Only images are supported"))
        }
    }
})

export default upload