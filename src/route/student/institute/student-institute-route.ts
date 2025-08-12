import { Router } from "express";
import asyncErrorHandler from "../../../services/async.error";
import stdCtrl from "../../../controller/student/institute/student-institute.controller";

const stuentRouter:Router = Router()


stuentRouter.route('/institute').get(asyncErrorHandler(stdCtrl.instituteLists))
stuentRouter.route("/institute/:instituteId/courses").get(asyncErrorHandler(stdCtrl.instituteCourseListForStudents))

export default stuentRouter