import express from "express";
import authRouter from "./route/globals/auth/auth.route";
import instituteRouter from "./route/institute/insitute.routes";

import teacherRouter from "./route/institute/teacher/teacher.route";
import courseRouter from "./route/institute/courses/course.route";
import categoryRouter from "./route/institute/category/category.route";
import teachRouter from "./route/teacher/teacher.route";
import cors from "cors";
import lessonRouter from "./route/teacher/courses/lesson/lesson.route";
import courseChapterRouter from "./route/teacher/courses/chatpters/chapter.route";
import stuentRouter from "./route/student/institute/student-institute-route";


const app = express();

app.use(express.json());

//cors config
app.use(cors({
    origin:"http://localhost:3000"
}))

//global route
app.use("/api", authRouter);

//institute routes
app.use("/api/institute", instituteRouter);
app.use("/api/institute/course", courseRouter);
app.use("/api/institute/category", categoryRouter);
app.use("/api/institute/teacher", teacherRouter)

//teacher Route
app.use("/api/teacher", teachRouter);
app.use("/api/teacher/course",courseChapterRouter)
app.use("/api/teacher/course/",lessonRouter)


//student
app.use("/api/student/",stuentRouter)

export default app;
