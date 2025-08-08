import { Request } from "express";
import multer from "multer";

//locally store file
const storage = multer.diskStorage({
  //files ko location kata rakhne
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, "./src/uploads");
  },

  //aako file ko name k rakhne
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    // cb(null,"haha_"+file.originalname) //haha_hello.pdf
    cb(null, Date.now() + "-" + file.originalname); //43353-hello.pdf
  },
});

export { multer, storage };
