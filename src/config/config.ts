import {config} from "dotenv";
import { Dialect } from "sequelize";
config()

export const envConfig = {
    portNumber:process.env.PORT
}

export const dBConfig = {
    databaseName: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT as Dialect,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number (process.env.DB_PORT) 
}

export const appConfig = {
    jwtSecret:process.env.JWT_SECRET
}

export const cloduinarConfig = {
    cloudName : process.env.CLOUDINARY_CLOUD_NAME!, 
    apiKey :process.env.CLOUDINARY_API_KEY!,
    apiSecret : process.env.CLOUDINARY_API_SECRET!
}

export const gmailConfig = {
    gmailUser: process.env.NODEMAILER_GMAIL,
    gmailPassKey:process.env.NODEMAILER_PASSKEY
}