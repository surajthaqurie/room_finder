import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRouter = Router();

const authController = new AuthController();
authRouter.route("/signup").post(authController.signup);
authRouter.route("/login").post(authController.login);

export { authRouter };
