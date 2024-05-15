import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { API_ERROR_MESSAGE_CONSTANT } from "src/common/constant";
import { ApiError, InternalError } from "src/utils";

export const errorHandler = (NODE_ENV: string): ErrorRequestHandler => {
    return (err: Error, req: Request, res: Response, next: NextFunction): Response => {
        if (err instanceof ApiError) return ApiError.handleError(NODE_ENV, err, res);

        // Todo: add logger when production the err.message
        if (NODE_ENV === "production") return ApiError.handleError(NODE_ENV, new InternalError(API_ERROR_MESSAGE_CONSTANT.INTERNAL_SERVER_ERROR), res);

        return ApiError.handleError(NODE_ENV, new InternalError(err.message), res);
    };
};
