import { Router } from "express";
import { AuthController } from "./auth.controller";
import { isAuthenticate } from "src/middleware";
import { env } from "src/configs";

const authRouter = Router();

const authController = new AuthController();
authRouter.route("/signup").post(isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), authController.signup);
authRouter.route("/login").post(authController.login);

export { authRouter };
