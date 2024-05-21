import { Router } from "express";
import { UserController } from "./user.controller";

const userRouter = Router();
const userController = new UserController();

// TODO: Session middleware
userRouter.route("/").get(userController.getUsers);
userRouter.route("/me").get(userController.getUser).put(userController.updateUser).delete(userController.deleteUser);
userRouter.route("/enable-disable/:id").patch(userController.enableDisableUser);

export { userRouter };
