import { Router } from "express";
import InstituteController from "../../controller/institue/institutes.controller";
import Middleware from "../../middleware/middleware";
import asyncErrorHandler from "../../services/async.error";

const instituteRouter: Router = Router();

instituteRouter.route("/").post (asyncErrorHandler(Middleware.isLoggedIn),asyncErrorHandler(InstituteController.createInstitute),
asyncErrorHandler(InstituteController.createTeacher),asyncErrorHandler(InstituteController.createStudentTable),
asyncErrorHandler(InstituteController.createCourseTable),
asyncErrorHandler(InstituteController.createChapterTable),
asyncErrorHandler(InstituteController.createChapterLesson),asyncErrorHandler(InstituteController.createCategoryTable));

export default instituteRouter;
