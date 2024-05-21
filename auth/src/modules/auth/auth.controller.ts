import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { loginValidation, signupValidation } from "./auth.validation";
import { AUTH_MESSAGE_CONSTANT } from "../../common/constant";
import { BadRequestError, Logger, SuccessCreatedResponse, SuccessResponse } from "src/utils";

export class AuthController {
    authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(AuthController.name + "-signup");
        try {
            const { error, value } = signupValidation(req.body);
            if (error) throw new BadRequestError(error.details[0].message);

            const user = await this.authService.signup(value);

            return new SuccessCreatedResponse(AUTH_MESSAGE_CONSTANT.USER_SIGNUP_SUCCESS, user).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(AuthController.name + " -login");
        try {
            const { error, value } = loginValidation(req.body);
            if (error) throw new BadRequestError(error.details[0].message);

            const user = await this.authService.login(value);
            return new SuccessResponse(AUTH_MESSAGE_CONSTANT.USER_LOGIN_SUCCESS, user).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };
}
