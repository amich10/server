import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../interfaces/interfaces";
import { QueryTypes } from "sequelize";

class CourseController {
  createCourse = async (req: IExtendedRequest, res: Response) => {
    const currentInstituteNumber = req.user?.currentInstituteNumber;
    const {
      courseName,
      coursePrice,
      courseDuration,
      courseLevel,
      courseDescription,
      categoryId,
    } = req.body;

    if (
      !courseName ||
      !coursePrice ||
      !courseDuration ||
      !courseLevel ||
      !courseDescription ||
      !categoryId
    ) {
      return res.status(400).json({
        message: "Please provide all the course information",
      });
    }
    const courseThumbnail = req.file ? req.file.path : null;

    await sequelize.query(
      `INSERT INTO courses_${currentInstituteNumber}(courseName,coursePrice,courseDuration,courseLevel,courseDescription,courseThumbnail,categoryId) VALUES(?,?,?,?,?,?,?)`,
      {
        replacements: [
          courseName,
          coursePrice,
          courseDuration,
          courseLevel,
          courseDescription,
          courseThumbnail,
          categoryId,
        ],
      }
    );

    const newCourse = await sequelize.query(`SELECT * FROM courses_${currentInstituteNumber} where courseName=?`,{
      replacements:[courseName],
      type:QueryTypes.SELECT
    })

    res.status(201).json({
      message: "New course created",
      data:newCourse[0]
    });
  };

  updateCourse = async (
    req: IExtendedRequest,
    res: Response
  ): Promise<void> => {
    const insituteNumber = req.user?.currentInstituteNumber;
    try {
      if (req.body === undefined) {
        res.status(400).json({
          message: "No data was sent",
        });
        return;
      }
      const courseId = req.params.id;
      const {
        courseName,
        coursePrice,
        courseDuration,
        courseLevel,
        courseDescription,
        categoryId,
      } = req.body;
      if (
        !courseName ||
        !coursePrice ||
        !courseDuration ||
        !courseLevel ||
        !courseDescription ||
        !categoryId
      ) {
        res.status(400).json({
          message:
            "please provide coursename, coursePrice, courseDuration, courseLevel, courseDescription and categoryId",
        });
        return;
      }
      const courseThumbnail = req.file ? req.file.path : null;

      const course = await sequelize.query(
        `SELECT * FROM courses_${insituteNumber} Where id = ?`,
        {
          replacements: [courseId],
          type: QueryTypes.SELECT,
        }
      );

      if (course.length === 0) {
        res.status(404).json({
          message: "course not found",
        });
      }

      await sequelize.query(
        `UPDATE courses_${insituteNumber} SET courseName = ?, coursePrice = ?, courseDuration = ?, courseLevel = ?, courseDescription=?, categoryId = ?, courseThumbnail = ? WHERE id = ?`,
        {
          replacements: [
            courseName,
            coursePrice,
            courseDuration,
            courseLevel,
            courseDescription,
            categoryId,
            courseThumbnail,
            courseId,
          ],
          type: QueryTypes.UPDATE,
        }
      );

      res.status(200).json({
        message: "Course updated successfully",
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  deleteCoure = async (req: IExtendedRequest, res: Response) => {
    const insituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;
    try {
      const courseData = await sequelize.query(
        `SELECT * FROM courses_${insituteNumber} WHERE id=?`,
        {
          replacements: [courseId],
          type: QueryTypes.SELECT,
        }
      ); //returns array or similar to findAll

      if (courseData.length == 0) {
        res.status(404).json({
          message: "Course does not exists",
        });
        return;
      }

      await sequelize.query(
        `DELETE FROM courses_${insituteNumber} WHERE id = ?`,
        {
          replacements: [courseId],
          type: QueryTypes.DELETE,
        }
      );

      res.status(200).json({
        message: "course deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Error occured in deleting course",
      });
    }
  };

  getAllCourse = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;

    const courses = await sequelize.query(
      `SELECT c.*,cat.categoryName FROM courses_${instituteNumber} AS c JOIN category_${instituteNumber} AS cat ON c.categoryId = cat.id`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
      message: "All courses fetched",
      data: courses,
    });
  };

  getSingleCourse = async (req: IExtendedRequest, res: Response) => {
    const insituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;

    const course = await sequelize.query(
      `SELECT * FROM courses_${insituteNumber} where id =?`,
      {
        replacements: [courseId],
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
      message: "A single course fetched",
      data: course,
    });
  };
}

const courseCtrl = new CourseController();

export default courseCtrl;
