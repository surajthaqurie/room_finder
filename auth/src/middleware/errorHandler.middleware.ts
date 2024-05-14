import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { API_ERROR_MESSAGE_CONSTANT } from "src/common/constant";

import { env } from "src/configs";
import { ApiError, InternalError } from "src/utils";

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    if (err instanceof ApiError) return ApiError.handleError(err, res);

    // Todo: add logger when production the err.message
    if (env.appConfig.NODE_ENV === "production") return ApiError.handleError(new InternalError(API_ERROR_MESSAGE_CONSTANT.INTERNAL_SERVER_ERROR), res);

    return ApiError.handleError(new InternalError(err.message), res);
};
