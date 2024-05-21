import { Router } from "express";
import { userRouter } from "../modules/users";
import { isAuthenticate } from "src/middleware";
import { env } from "src/configs";

const router = Router();

router.use("/users", isAuthenticate({ tokenSecret: env.jwtConfig.JWT_SECRET }), userRouter);

export default router;
