import { Router } from "express";
import asyncErrorHandler from "../../services/async.error";
import teacherLogin from "../../controller/teacher/teacher.controller";


const teachRouter: Router = Router();

teachRouter.route("/login").post(asyncErrorHandler(teacherLogin));

export default teachRouter;
