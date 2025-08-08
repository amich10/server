import { Router } from "express";
import Middleware from "../../../../middleware/middleware";
import { UserRole } from "../../../../interfaces/interfaces";
import lessonCtrl from "../../../../controller/teacher/courses/lesson/lesson-controller";

const lessonRouter:Router = Router() 

lessonRouter.route(`/chapter:id/lessons`).post(Middleware.isLoggedIn,Middleware.restrictTo(UserRole.TEACHER),lessonCtrl.addLesson).
get(Middleware.isLoggedIn,Middleware.restrictTo(UserRole.TEACHER),lessonCtrl.fetchChapterLessons)

export default lessonRouter;