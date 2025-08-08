import { Router } from "express";
import Middleware from "../../../../middleware/middleware";
import asyncErrorHandler from "../../../../services/async.error";
import courseChapterCtrl from "../../../../controller/teacher/courses/chapters/chapter-controller";
import { UserRole } from "../../../../interfaces/interfaces";

const courseChapterRouter:Router = Router()


courseChapterRouter.route(`/:courseId/chapters`).post(Middleware.isLoggedIn,Middleware.restrictTo(UserRole.TEACHER),
asyncErrorHandler(courseChapterCtrl.addChapterToCourse))
.get(Middleware.isLoggedIn,Middleware.restrictTo(UserRole.TEACHER),asyncErrorHandler(courseChapterCtrl.fetchAllCourseChapters))

export default courseChapterRouter;