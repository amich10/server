import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query"
import sequelize from "../../../../database/connection"
import { IExtendedRequest } from "../../../../interfaces/interfaces"
import { Response } from "express"
import { QueryTypes } from "sequelize"

class ChapterLessonController {
    addLesson = async (req: IExtendedRequest, res: Response):Promise<void> => {
        try {
            const instituteNumber = req.user?.currentInstituteNumber

            const { lessonName, lessonDescription, lessonThumbnail, lessonVideoUrl, chapterId } = req.body

            if (!lessonName || !lessonDescription || !lessonThumbnail || lessonVideoUrl || !chapterId) {
                res.json({
                    message: "Please provide lessonName, lessoneThumbnail, lessonDescrptipion, lessonVideoUrl and chappterId"
                })
                return
            }

            await sequelize.query(`INSERT INTO TABLE chapter_lesson_${instituteNumber} (lessonName, lessonDescription,lessonThumbnail,lessonVideoUrl,chapterId) VALUES(?,?,?,?,?)`, {
                replacements: [lessonName, lessonDescription, lessonThumbnail, lessonVideoUrl, chapterId],
                type: QueryTypes.INSERT
            })

            res.status(200).json({
                message: "lesson added successfully",
                data: {
                    lessonName,
                    lessonDescription,
                    lessonThumbnail,
                    lessonVideoUrl,
                    chapterId
                }
            })

        } catch (error) {
            console.log(error)
        }
    }
    fetchChapterLessons = async (req: IExtendedRequest, res: Response) => {
        try {
            const { chapterId } = req.params;
            const instituteNumber = req.user?.currentInstituteNumber

            if(!chapterId) res.status(400).json({
                message:"Please provide chapterid"
            })

            const lessons = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE chapterId=?`,{
                replacements:[chapterId],
                type:QueryTypes.SELECT
            })
            res.status(200).json({
                message:"All lesson fetched",
                data:lessons
            })
        } catch (error) {
            console.log(error)
        }


    }
}

const lessonCtrl = new ChapterLessonController()
export default lessonCtrl