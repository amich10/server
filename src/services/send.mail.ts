import nodemailer from "nodemailer";
import { gmailConfig } from "../config/config";
import { IMailInformation } from "../interfaces/interfaces";

const sendMail = async (mailInfor: IMailInformation) => {
  //create node mailer transport or configuration setup

  const transporter = nodemailer.createTransport({
    service: "gmail", //gmail or yahoo or hotmail
    auth: {
      //sender ko email and pass (org ko)
      user: process.env.NODEMAILER_GMAIL,
      pass: process.env.NODEMAILER_PASSKEY, //real password haina app password. go to gmail, manage account and search for app password
    },
  });

  console.log("Using Gmail:", gmailConfig.gmailUser);

  const mailFormatObject = {
    from: gmailConfig.gmailUser,
    to: mailInfor.to,
    subject: mailInfor.subject,
    text: mailInfor.text,
    html:mailInfor.html
  };

  try {
    await transporter.sendMail(mailFormatObject);
  } catch (error) {
    console.log(error);
  }
};
export default sendMail;
