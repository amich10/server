import { Request, Response } from "express";
import sequelize from "../../database/connection";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import generateJwtToken from "../../services/generate.jwt.token";

interface ITeacherData {
  teacherEmail: string;
  teacherPassword: string;
  id: string;
}

const teacherLogin = async (req: Request, res: Response) => {
  console.log(req.body);
  const { teacherEmail, teacherPassword, teacherInstituteNumber } = req.body;

  if (!teacherEmail || !teacherPassword || !teacherInstituteNumber) {
    res.status(400).json({
      message: "Please provide teacherEmail and teacherPassword",
    });
    return;
  }

  const teacherData: ITeacherData[] = await sequelize.query(
    `SELECT * FROM teacher_${teacherInstituteNumber} WHERE teacherEmail = ?`,
    {
      type: QueryTypes.SELECT,
      replacements: [teacherEmail],
    }
  );

  if (teacherData.length === 0) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  //compare password provided and that of stored in db
  const isPasswordMatched = bcrypt.compareSync(
    teacherPassword,
    teacherData[0].teacherPassword
  );

  if (!isPasswordMatched) {
    res.status(400).json({
      message: "Invalid credentials",
    });
  } else {
    //token generation
    const token = generateJwtToken({
      id: teacherData[0].id,
      instituteNumber: teacherInstituteNumber,
    });
    res.status(200).json({
      message: "Teacher logged in",
      data:{
        teacherToken:token,
        teacherEmail,
        teacherInstituteNumber
      }
    });
  }
};

export default teacherLogin;
