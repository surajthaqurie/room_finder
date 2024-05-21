import { Response } from "express";
import { ErrorType } from "src/common/enum";
import { ConflictResponse, BadRequestResponse, InternalErrorResponse, UnauthorizedResponse, ForbiddenResponse, NotFoundResponse } from "./api-response";
import { API_ERROR_MESSAGE_CONSTANT } from "src/common/constant";

export abstract class ApiError extends Error {
    constructor(public type: ErrorType, override message: string) {
        super(type);
    }

    public static handleError(NODE_ENV: string, err: ApiError, res: Response): Response {
        switch (err.type) {
            case ErrorType.CONFLICT_REQUEST:
                return new ConflictResponse(err.message).sendResponse(res);
            case ErrorType.BAD_REQUEST:
                return new BadRequestResponse(err.message).sendResponse(res);
            case ErrorType.NOT_FOUND:
            case ErrorType.NO_DATA:
            case ErrorType.NO_ENTRY:
                return new NotFoundResponse(err.message).sendResponse(res);
            case ErrorType.UNAUTHORIZED:
                return new UnauthorizedResponse(err.message).sendResponse(res);
            case ErrorType.FORBIDDEN:
                return new ForbiddenResponse(err.message).sendResponse(res);
            case ErrorType.INTERNAL:
                return new InternalErrorResponse(err.message).sendResponse(res);
            default: {
                let message = err.message;
                if (NODE_ENV === "production") message = API_ERROR_MESSAGE_CONSTANT.INTERNAL_SERVER_ERROR;
                return new InternalErrorResponse(message).sendResponse(res);
            }
        }
    }
}

export class ConflictRequestError extends ApiError {
    constructor(message: string) {
        super(ErrorType.CONFLICT_REQUEST, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(ErrorType.NOT_FOUND, message);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(ErrorType.BAD_REQUEST, message);
    }
}

export class UnauthorizedRequestError extends ApiError {
    constructor(message: string) {
        super(ErrorType.UNAUTHORIZED, message);
    }
}

export class ForbiddenRequestError extends ApiError {
    constructor(message: string) {
        super(ErrorType.FORBIDDEN, message);
    }
}

export class InternalError extends ApiError {
    constructor(message: string) {
        super(ErrorType.INTERNAL, message);
    }
}
