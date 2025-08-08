import jwt from "jsonwebtoken"
import { appConfig } from "../config/config"

const generateJwtToken = (data:{
    id:string,
    instituteNumber ? :string
}) =>{
    const token = jwt.sign(data,appConfig.jwtSecret!,{
        expiresIn:"30d"
    })
    return token
}

export default generateJwtToken;