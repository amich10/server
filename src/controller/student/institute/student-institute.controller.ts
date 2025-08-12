
import { Response,Request } from "express";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

class StudentController {
    instituteLists = async(req:Request,res:Response) =>{
        const institutes = await sequelize.query(`SHOW TABLES LIKE "institute_%"`,{
            type:QueryTypes.SHOWTABLES
        })
        console.log(institutes)
        let allDatas = []
        for (let insitute of institutes){
            const instituteNumber = insitute.split("_")[1]
            const [data] = await sequelize.query(`SELECT instituteName, institutePhonenUMBER FROM ${insitute}`,{
                type:QueryTypes.SELECT
            })
            allDatas.push({instituteNumber,...data})
        }
        res.status(200).json({
            msssage:"All institutes",
            data:allDatas
        })
    }

    instituteCourseListForStudents = async (req:Request,res:Response) =>{
        const {instituteId} = req.params


        const courses = await sequelize.query(`SELECT * FROM courses_${instituteId} AS c JOIN category_${instituteId} AS cat on c.categoryId = cat.Id `,{
            type:QueryTypes.SELECT
        })
        if(courses.length == 0){
            res.status(400).json({
                message:"Courses not found"
            })
        }

        res.status(200).json({
            message:"Institute courses fetched",
            data:courses
        })
    }
}

const stdCtrl = new StudentController()

export default stdCtrl