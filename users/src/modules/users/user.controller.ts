import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { USER_MESSAGE_CONSTANT } from "src/common/constant";
import { userRegisterValidation, userUpdateValidation } from "./user.validation";
import { BadRequestError, Logger, SuccessResponse } from "src/utils";

export class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    registerUser = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(UserController.name + "-registerUser");
        try {
            const { error, value } = userRegisterValidation(req.body);
            if (error) throw new BadRequestError(error.details[0].message);

            const user = await this.userService.registerUser(value);

            return res.status(201).json({
                success: true,
                message: USER_MESSAGE_CONSTANT.USER_CREATED_SUCCESSFULLY,
                data: user
            });
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(UserController.name + "-getUsers");
        try {
            const query = {
                page: parseInt(req.query.page as string),
                pageSize: parseInt(req.query.pageSize as string)
            };

            const users = await this.userService.getUsers(query);
            return new SuccessResponse(USER_MESSAGE_CONSTANT.USERS_FETCHED_SUCCESSFULLY, users).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(UserController.name + "-getUser");
        try {
            const user = await this.userService.getUser(req.params.id);
            return new SuccessResponse(USER_MESSAGE_CONSTANT.USERS_FETCHED_SUCCESSFULLY, user).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(UserController.name + "-updateUser");
        try {
            const { error, value } = userUpdateValidation(req.body);
            if (error) throw new BadRequestError(error.details[0].message);

            const userId = req.params.id;
            const user = await this.userService.updateUser(userId, value);
            return new SuccessResponse(USER_MESSAGE_CONSTANT.USER_UPDATED_SUCCESSFULLY, user).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };

    enableDisableUser = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(UserController.name + "-enableDisableUser");
        try {
            const userId = req.params.id;
            const { message, data } = await this.userService.enableDisableUser(userId);
            return new SuccessResponse(message, data).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger(UserController.name + "-deleteUser");
        try {
            const userId = req.params.id;
            const user = await this.userService.deleteUser(userId);

            return new SuccessResponse(USER_MESSAGE_CONSTANT.USER_DELETED_SUCCESSFULLY, user).sendResponse(res);
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    };
}
