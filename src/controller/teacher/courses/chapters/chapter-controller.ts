
import { Response } from "express"
import { IExtendedRequest } from "../../../../interfaces/interfaces";
import sequelize from "../../../../database/connection";
import { json, QueryTypes } from "sequelize";
class CourseChapterController {
    addChapterToCourse = async (req: IExtendedRequest, res: Response) => {
        try {
            const courseId = req.params
            const instituteNumber = req.user?.currentInstituteNumber

            const { chapterName, chapterDuration, chapterLevel } = req.body

            if (!chapterName || !chapterDuration || !chapterLevel || !courseId) {
                return res.status(400).json({
                    message: "Please provide all the course chapter infromation"
                })
            }

            //check if course exists or not
            const [course] = await sequelize.query(`SELECT * FROM courses_${instituteNumber} WHERE id=? `, {
                replacements: [courseId],
                type: QueryTypes.SELECT
            })

            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            const [courseChapter] = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE chapterName=? AND courseId=?`,{
                replacements:[chapterName,courseId],
                type:QueryTypes.SELECT
            })

            if(course){
                return res.status(400).json({
                    message:"ChapterName already exits in that course"
                })
            }

            const data= await sequelize.query(
                `INSERT INTO course_chapter_${instituteNumber}(chapterName, chapterDuration, chapterLevel, courseId) VALUES (?, ?, ?, ?)`,
                {
                    replacements: [chapterName, chapterDuration, chapterLevel, courseId],
                    type: QueryTypes.INSERT
                }
            );

            res.status(200).json({
                message:"Chapter added successfully",
                data
            })

        } catch (error) {
            console.log(error)
        }
    }

    fetchAllCourseChapters = async(req:IExtendedRequest,res:Response) =>{
        try {
           const courseId = req.params;
           const instituteNumber = req.user?.currentInstituteNumber

           if(!courseId) return res.status(400).json({
            message:"Please provide courseId"
           })

           const datas = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE courseId=?`,{
            replacements:[courseId],
            type:QueryTypes.SELECT
           })

          if(!datas){
             res.status(200).json({
            message:"All chapter from  course fetched",
            data:datas
           })
          }else{
            res.status(404).json({
                message:"Chapters not found from that course"
            })
          }

        } catch (error) {
            console.log(error)
        }
    }
}

const courseChapterCtrl = new CourseChapterController()
export default courseChapterCtrl;