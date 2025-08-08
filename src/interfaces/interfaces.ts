import { Request } from "express"


export enum UserRole {
    TEACHER ="teacher",
    INSTITUTE="institute",
    SUPERADMIN="super-admin",
    STUDENT="student"

}


export interface IExtendedRequest extends Request {
    user ?: {
        id:string,
        currentInstituteNumber:string | number,
        role:UserRole
        
    },
    instituteNumber?: number
}

export interface IMailInformation {
    to:string,
    subject:string,
    text?:string,
    html?:string
}