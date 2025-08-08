import { Request, Response } from "express";
import User from "../../../database/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../../../config/config";
import generateJwtToken from "../../../services/generate.jwt.token";

class AuthConroller {
  register = async (req: Request, res: Response) => {
    if (req.body === undefined) {
      //if no data is sent
      res.status(400).json({
        message: "No data was sent.",
      });
      return;
    }
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide email, username and password.",
      });
      return;
    }
    // Check if user already exists with the same email
    const existingUser = await User.findOne({ where: { email } }); //application level validation
    if (existingUser) {
      res.status(409).json({
        message: "Email is already registered.",
      });
      return;
    }
    // Create new user
    const user = await User.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
    });
    res.status(201).json({
      data: user,
      message: "User created successfully",
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    if (req.body === undefined) {
      res.status(400).json({
        message: "No data was sent.",
      });
      return; // else lekhnu xaina vane
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required.",
      });
      return;
    }

    //SELECT * FROM USER where email = "example@example.com"
    const user = await User.findAll({
      where: {
        email: email,
      },
    }); // returns Array
    if (user.length == 0) {
      //data checking for array
      res.status(404).json({
        message: "user not registered.",
      });
      return;
    } else {
      //check password : password = hash coversion => 12@1snfaj$ => compare hash (hash representation differs each time password is entered but its value is same)

      //compare() or compareSync(user bata aako password, hashed pasword in db table)
      const isPasswordMatch = bcrypt.compareSync(password, user[0].password);
      if (isPasswordMatch) {
        //login vayo and move on to  token generation
        const token = generateJwtToken({ id:user[0].id });

        res.json({
          data:{
            username:user[0].username,
            token: token,
          },
          message: "User sucessfully logged in.",
        });
        return;
      } else {
        res.status(401).json({
          message: "Credentials does not match.", // message ma pasword doesnot match rakhyo vane security issue auxa  so credentials doesnot match.
        });
      }
      return;
    }

    /*  const user = await User.findOne({ where: { email } }); //check if user exits with that email // returns object */
    /*  if (!user) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      } */
  };
}
const authCtrl = new AuthConroller();

export default authCtrl;
