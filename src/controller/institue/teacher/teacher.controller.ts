import { QueryTypes } from "sequelize";

import { Response } from "express";
import bcrypt from "bcrypt";
import { IExtendedRequest } from "../../../interfaces/interfaces";
import generateRandomPassword from "../../../services/generate.random.password";
import sequelize from "../../../database/connection";
import sendMail from "../../../services/send.mail";

class TeacherController {
  static createTeacher = async (
    req: IExtendedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      const teacherPhoto = req.file ? req.file.path : null;
      const {
        teacherName,
        teacherEmail,
        teacherPhoneNumber,
        teacherAddress,
        teacherExperience,
        salary,
        joinedDate,
        courseId,
      } = req.body;

      if (
        !teacherName ||
        !teacherEmail ||
        !teacherPhoneNumber ||
        !teacherExperience ||
        !teacherAddress||
        !salary ||
        !joinedDate
      ) {
        res.status(400).json({
          message: "Please, provide all the required information",
        });
        return;
      }

      const data = generateRandomPassword(teacherName);
       await sequelize.query(
        `INSERT INTO teacher_${instituteNumber} (teacherName,teacherEmail,teacherAddress, teacherPhoneNumber,teacherExperience,joinedDate,salary,teacherPhoto,teacherPassword,courseId) VALUES(?,?,?,?,?,?,?,?,?,?)`,
        {
          replacements: [
            teacherName,
            teacherEmail,
            teacherAddress,
            teacherPhoneNumber,
            teacherExperience,
            joinedDate,
            salary,
            teacherPhoto,
            data.hashedVersion,
            courseId,
          ],
          type: QueryTypes.INSERT,
        }
      );

      const newTeacher: { id: string }[] = await sequelize.query(
        `SELECT * FROM teacher_${instituteNumber} WHERE teacherEmail = ?`,
        {
          replacements: [teacherEmail],
          type: QueryTypes.SELECT,
        }
      );

      await sequelize.query(
        `UPDATE courses_${instituteNumber} SET teacherId = ? WHERE id = ?`,
        {
          replacements: [newTeacher[0].id, courseId],
          type: QueryTypes.UPDATE,
        }
      );

      //send mail
      const mailInformation = {
        to: teacherEmail,
        subject: "Welcome to the Institute",
        html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to Our Institute, ${teacherName}!</h2>
      <p>
        We are excited to have you join our team. Your account has been successfully created.
      </p>
      <table style="margin: 16px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Login Email:</td>
          <td style="padding: 8px;">${teacherEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Temporary Password:</td>
          <td style="padding: 8px;">${data.plainVersion}</td>
        </tr>
      </table>
      <p>
        Please log in and change your password as soon as possible for security reasons.
      </p>
      <p>
        If you have any questions, feel free to contact the administration.
      </p>
      <br/>
      <p>Best regards,<br/>Institute Administration</p>
    </div>
  `,
      };

      try {
        await sendMail(mailInformation);
        console.log(mailInformation)
      } catch (error) {
        console.log("mail error",error)
      }

      res.status(200).json({
        message:
          "teacher created. Please check your entered email to view you login credentials.",
          data:newTeacher[0]
      });
    } catch (exception) {
      console.log(exception);
      res.status(400).json({
        message: "Teacher cannot be created.",
      });
    }
  };
  static updateTeacher = async (req: IExtendedRequest, res: Response) => {
    const instituteNumer = req.user?.currentInstituteNumber;
    const teacherId = req.params.id;
    if (req.body === undefined) {
      res.status(400).json({
        message: "No data was sent",
      });
      return;
    }
    const teacherPhoto = req.file ? req.file.path : null;
    const {
      teacherName,
      teacherEmail,
      teacherPhoneNumber,
      teacherAddress,
      teacherExperience,
      teacherSalary,
      teacherJoinedDate,
      teacherPassword,
    } = req.body;

    if (
      !teacherName ||
      !teacherEmail ||
      !teacherPhoneNumber ||
      !teacherAddress ||
      !teacherExperience ||
      !teacherSalary ||
      !teacherJoinedDate
    ) {
      res.status(400).json({
        message: "Please, provide all the required information",
      });
      return;
    }

    const teacher = await sequelize.query(
      `SELECT * FROM teacher_${instituteNumer} where id = ?`,
      {
        replacements: [teacherId],
        type: QueryTypes.SELECT,
      }
    );

    if (!teacher) {
      res.status(400).json({
        message: "Teacher does not exists",
      });
    }

    await sequelize.query(
      `UPDATE teacher_${instituteNumer} SET teacherName = ?, teacherEmail = ?, teacherPhoneNumber = ?, teacherAddress = ?, teacherExperience = ?, salary = ?, joinedDate = ?, teacherPhoto = ?, teacherPassword = ?`,
      {
        replacements: [
          teacherName,
          teacherEmail,
          teacherPhoneNumber,
          teacherAddress,
          teacherExperience,
          teacherSalary,
          teacherJoinedDate,
          teacherPhoto,
          bcrypt.hashSync(teacherPassword, 10),
        ],
        type: QueryTypes.UPDATE,
      }
    );

    res.status(200).json({
      message: "Teacher updated successfully",
    });
  };

  static getSingleTecher = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const teacherId = req.params.id;

    const teacher = await sequelize.query(
      `SELECT * FROM teacher_${instituteNumber} where id = ?`,
      {
        replacements: [teacherId],
        type: QueryTypes.SELECT,
      }
    );

    if (!teacher) {
      res.status(400).json({
        message: "Teacher does not exits",
      });
    } else {
      res.status(200).json({
        message: "A single teacher fetched",
        data: teacher,
      });
    }
  };

  static getAllTeacher = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const allTeacher = await sequelize.query(
      `SELECT t.*,c.courseName FROM teacher_${instituteNumber} AS t JOIN courses_${instituteNumber} AS c ON t.courseId = c.id`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!allTeacher) {
      res.status(400).json({
        message: "No teachers data were found",
      });
      return;
    } else {
      res.status(200).json({
        message: "All teachers data fetched",
        data: allTeacher,
      });
    }
  };

  static deleteTeacher = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const teacherId = req.params.id;

    const teacher = await sequelize.query(
      `SELECT * FROM teacher_${instituteNumber} WHERE id =?`,
      {
        replacements: [teacherId],
        type: QueryTypes.SELECT,
      }
    );

    if (!teacher) {
      res.status(400).json({
        message: "Teacher not found",
      });
      return;
    } else {
      await sequelize.query(
        `DELETE FROM teacher_${instituteNumber} WHERE id = ?`,
        {
          replacements: [teacherId],
          type: QueryTypes.DELETE,
        }
      );
    }
    res.status(200).json({
      message: "Teacher deleted successfully",
    });
  };
}

export default TeacherController;
