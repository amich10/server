import bcrypt from "bcrypt";

const generateRandomPassword = (teacherName:string) =>{
    const randomNumber = Math.floor(1000 + Math.random() * 90000)
    const passwordData = {
        hashedVersion: bcrypt.hashSync(`${randomNumber}_${teacherName}`,10), //table ma store garna ko lagui
        plainVersion:`${randomNumber}_${teacherName}` //teacher lai mail garna ko lagi
    }
    return passwordData
}
export default generateRandomPassword;