import { Response } from "express";
import { HttpStatus } from "src/common/enum";

abstract class ApiResponse {
    constructor(protected status: HttpStatus, protected success: boolean, protected message: string) {}

    protected prepareResponse<T extends ApiResponse>(res: Response, response: T, headers: { [key: string]: string }): Response {
        return res.status(this.status).json(ApiResponse.sanitizeResponse(response));
    }

    public sendResponse(res: Response, headers: { [key: string]: string } = {}): Response {
        return this.prepareResponse<ApiResponse>(res, this, headers);
    }

    private static sanitizeResponse<T extends ApiResponse>(response: T): T {
        const clone: T = {} as T;
        Object.assign(clone, response);

        // delete clone.status;
        for (const i in clone) if (typeof clone[i] === "undefined") delete clone[i];

        return clone;
    }
}

export class ConflictResponse extends ApiResponse {
    constructor(message: string) {
        super(HttpStatus.CONFLICT, false, message);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message: string) {
        super(HttpStatus.BAD_REQUEST, false, message);
    }
}

export class UnauthorizedResponse extends ApiResponse {
    constructor(message: string) {
        super(HttpStatus.UNAUTHORIZED, false, message);
    }
}

export class NotFoundResponse extends ApiResponse {
    constructor(message: string) {
        super(HttpStatus.NOT_FOUND, false, message);
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message: string) {
        super(HttpStatus.FORBIDDEN, false, message);
    }
}

export class InternalErrorResponse extends ApiResponse {
    constructor(message: string) {
        super(HttpStatus.INTERNAL_ERROR, false, message);
    }
}

export class SuccessResponse<T> extends ApiResponse {
    constructor(message: string, protected data: T) {
        super(HttpStatus.SUCCESS, true, message);
    }

    override sendResponse(res: Response, headers: { [key: string]: string } = {}): Response {
        return super.prepareResponse<SuccessResponse<T>>(res, this, headers);
    }
}

export class SuccessCreatedResponse<T> extends ApiResponse {
    constructor(message: string, protected data: T) {
        super(HttpStatus.CREATED, true, message);
    }

    override sendResponse(res: Response, headers: { [key: string]: string } = {}): Response {
        return super.prepareResponse<SuccessCreatedResponse<T>>(res, this, headers);
    }
}
