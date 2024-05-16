import { Router } from "express";
import { UserController } from "./user.controller";
import { isAuthenticate } from "src/middleware";
import { env } from "src/configs";

const userRouter = Router();
const userController = new UserController();

// TODO: Session middleware
userRouter.route("/").get(isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), userController.getUsers);
userRouter
    .route("/:id")
    .get(isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), userController.getUser)
    .put(isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), userController.updateUser)
    .delete(isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), userController.deleteUser);
userRouter.route("/enable-disable/:id").patch(isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), userController.enableDisableUser);

export { userRouter };
