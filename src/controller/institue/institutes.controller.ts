import { NextFunction, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/utils";
import { IExtendedRequest } from "../../interfaces/interfaces";
import User from "../../database/models/user.model";
import categories from "../../../seed";

class InstituteController {
  static async createInstitute(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    const {
      instituteName,
      instituteEmail,
      institutePhoneNumber,
      instituteAddress,
    } = req.body;

    //only one out of these two
    const instituteVatNo = req.body.instituteVatNo || null;
    const institutePanNo = req.body.institutePanNo || null;

    if (
      !instituteName ||
      !instituteEmail ||
      !institutePhoneNumber ||
      !instituteAddress
    ) {
      res.status(400).json({
        message:
          "Please provide instituteName, instituteEmail,institutePhoneNumber and instituteAddress",
      });
      return;
    }
    //ayo vane  => institute create garnu paryo  => institute_123123,insitute_234234

    const instituteNumber = generateRandomInstituteNumber();

    await sequelize.query(`CREATE TABLE IF NOT EXISTS  institute_${instituteNumber} (
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR(255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            instituteVatNo VARCHAR(255),
            institutePanNo VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);

    await sequelize.query(
      `INSERT INTO institute_${instituteNumber} 
        (instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNo, institutePanNo) VALUES (?,?,?,?,?,?)`,
      {
        replacements: [
          instituteName,
          instituteEmail,
          institutePhoneNumber,
          instituteAddress,
          instituteVatNo,
          institutePanNo,
        ],
      }
    );

    //create a user_institute history table jaha chai users le kk institutte create garyo sabbai herna payo
    await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institutes (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        userId VARCHAR(255) REFERENCES users(id),
        instituteNumber VARCHAR(255) UNIQUE
      )`);

    if (req.user) {
      await sequelize.query(
        `INSERT INTO user_institutes(userId, instituteNumber) VALUES(?, ?)`,
        {
          replacements: [req.user.id, instituteNumber],
        }
      );

      await User.update(
        {
          currentInstituteNumber: instituteNumber,
          role: "institute",
        },
        {
          where: { id: req.user.id },
        }
      );
    }
    if (req.user) {
      req.user.currentInstituteNumber = instituteNumber;
    }
    // req.user?.instituteNumber = instituteNumber
    next();
  }

  static createTeacher = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS  teacher_${instituteNumber} (
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            teacherAddress VARCHAR(255) NOT NULL,
            teacherExperience VARCHAR(255), 
            joinedDate DATE,
            salary VARCHAR(100),
            teacherPhoto VARCHAR(255),
            teacherPassword VARCHAR(255),
            courseId VARCHAR (255) REFERENCES courses_${instituteNumber}(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);
    next();
  };

  static createStudentTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        studentName VARCHAR(255) NOT NULL,
        studentEmail VARCHAR(255) NOT NULL UNIQUE,
        studentPhoneNumber VARCHAR(20) NOT NULL UNIQUE,
        studentAddress TEXT NOT NULL,
        enrolledDate DATE,
        studentImage VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    next();
  };
  static createCourseTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      await sequelize.query(`CREATE TABLE IF NOT EXISTS courses_${instituteNumber} (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        courseName VARCHAR(255) NOT NULL,
        courseDescription Text NOT NULL,
        coursePrice DECIMAL(10,2) NOT NULL,
        courseDuration VARCHAR(100),
        courseThumbnail Text,
        courseLevel ENUM('beginner','intermediate','advance'),
        categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber} (id),
        teacherId VARCHAR(255) REFERENCES teacher_${instituteNumber} (id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
      next();
    } catch (exception) {
      console.log(exception);
    }
  };

  static createChapterTable = async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS course_chapter_${instituteNumber} (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      chapterName VARCHAR(255) NOT NULL,
      chapterDuration VARCHAR (255) NOT NULL,
      chapterLevel ENUM('beginner','intermediate','advance'),
      courseId VARCHAR(36) REFERENCES courses_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
        next()
  }

  static createChapterLesson= async(req:IExtendedRequest,res:Response,next:NextFunction) =>{
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS chapter_lesson_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      lessonName VARCHAR(255) NOT NULL,
      lessonDescription TEXT,
      lessonThumbnail VARCHAR(255),
      lessonVideoUrl VARCHAR(255),
      chapterId VARCHAR(36) REFERENCES course_chapter_${instituteNumber} ON DELETE CASCADE ON UPDATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`)
      next()
  }

  static createCategoryTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber} (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      categoryName VARCHAR(255) NOT NULL,
      categoryDescription TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    for (const category of categories) {
      await sequelize.query(
        `INSERT INTO category_${instituteNumber} (categoryName, categoryDescription) VALUES (?, ?)`,
        {
          replacements: [category.categoryName, category.categoryDescription],
        }
      );
    }
    res.status(201).json({
      message: "Institute created succesfully",
      instituteNumber,
    });
  };
}
export default InstituteController;
