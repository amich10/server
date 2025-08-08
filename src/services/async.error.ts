import { NextFunction, Request,Response } from "express";

//wrapper function
//higher order function: A function that takes another fucntion as a parameter => a function that returns another function.
const asyncErrorHandler = (fn:Function) =>{ 
    return (req:Request,res:Response,next:NextFunction) =>{
        fn(req,res,next).catch((err:Error) =>{
            console.log(err.message);
            return res.status(500).json({
                message:err.message,
                fullError:err
            })
        })
    }

}
export default asyncErrorHandler;