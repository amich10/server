import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import User from "../database/models/user.model";
import { IExtendedRequest, UserRole } from "../interfaces/interfaces";



class Middleware {
  static isLoggedIn = async(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    //check if login or not

    //accept token
    const token = req.headers.authorization; //jwt token
    if (!token) {
      res.status(401).json({
        message: "Please provide token",
      });
      return;
    }
    //verify token
    jwt.verify(token, appConfig.jwtSecret!, async(err, decoded:any) => {
      console.log(decoded)
      if (err) {
        res.status(403).json({
          message: "Token Invalid",
        });
      } else {
        const userData = await User.findByPk(decoded.id,{
          attributes:['id','currentInstituteNumber','role']
        })
        if(!userData){
            res.status(403).json({
                message:"No user with that id"
            })
        }else{
            req.user = userData
            next(); 
        }
      }
    });
  };
  static restrictTo = (...roles:UserRole[]) =>{ //["teacher","super-admin","institute"]
    return (req:IExtendedRequest,res:Response,next:NextFunction) =>{

      //requesting user ko role k xa tyo lini ani paramater ma aako role sanga match garni

      const userRole = req.user?.role as UserRole
      if(roles.includes(userRole)){
        next()
      }else{
        res.status(403).json({
          message:"You donot have access to this.."
        })
      }
    }
  }
}

export default Middleware;
