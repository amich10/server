import { Request, Router } from "express";

// import { multer, storage } from "./../../middleware/multer.middleware";


import multer from "multer";
import { storage } from "../../../services/cloudinary.config";
import Middleware from "../../../middleware/middleware";
import asyncErrorHandler from "../../../services/async.error";
import courseCtrl from "../../../controller/institue/course/course.controller";
import { UserRole } from "../../../interfaces/interfaces";

const courseRouter = Router();

const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are supported"));
    }
  },
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

courseRouter
  .route("/")
  .post(
    Middleware.isLoggedIn,

    //field name => frontend rw postman bata file name k airaxa tei rakhne upload ma
    upload.single("courseThumbnail"),
    Middleware.restrictTo(UserRole.INSTITUTE),
    asyncErrorHandler(courseCtrl.createCourse)
  )
  .get(Middleware.isLoggedIn, asyncErrorHandler(courseCtrl.getAllCourse));

courseRouter
  .route("/:id")
  .get(Middleware.isLoggedIn, Middleware.restrictTo(UserRole.INSTITUTE),asyncErrorHandler(courseCtrl.getSingleCourse))
  .patch(Middleware.isLoggedIn, upload.single("courseThumbnail"),asyncErrorHandler(courseCtrl.updateCourse))
  .delete(Middleware.isLoggedIn, asyncErrorHandler(courseCtrl.deleteCoure));

export default courseRouter;