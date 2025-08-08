import { Router } from "express";
import authCtrl from "../../../controller/globals/auth/auth.controller";
import asyncErrorHandler from "../../../services/async.error";

const authRouter: Router = Router();

authRouter.route("/register").post(asyncErrorHandler(authCtrl.register));
authRouter.route("/login").post(asyncErrorHandler(authCtrl.login));

export default  authRouter;
