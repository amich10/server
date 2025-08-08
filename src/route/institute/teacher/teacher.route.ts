import { Router } from "express";
import Middleware from "../../../middleware/middleware";
import upload from "../../../services/upload";
import TeacherController from "../../../controller/institue/teacher/teacher.controller";
import asyncErrorHandler from "../../../services/async.error";


const teacherRouter: Router = Router();

teacherRouter
  .route("/")
  .post(
    Middleware.isLoggedIn,
    upload.single("teacherPhoto"),
    TeacherController.createTeacher
  )
  .get(Middleware.isLoggedIn, TeacherController.getAllTeacher);
teacherRouter
  .route("/:id")
  .get(Middleware.isLoggedIn, TeacherController.getSingleTecher)
  .patch(
    Middleware.isLoggedIn,
    upload.single("teacherPhoto"),
    TeacherController.updateTeacher
  )
  .delete(
    Middleware.isLoggedIn,
    asyncErrorHandler(TeacherController.deleteTeacher)
  );

export default teacherRouter;
