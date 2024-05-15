import { NextFunction, Request, Response } from "express";
import { API_ERROR_MESSAGE_CONSTANT } from "src/common/constant";
import { JsonWebToken, UnauthorizedRequestError } from "src/utils";
import { JwtPayload } from "jsonwebtoken";

export const isAuthenticate = (config: { tokenSecret: string }) => {
    const jsonWebToken = new JsonWebToken();

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token: string | undefined;

            token = (req.headers["Authorization"] as string) || req.headers["authorization"];
            if (!token) throw new UnauthorizedRequestError(API_ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);
            token = token.replace("Bearer ", "");

            // Verify the token
            const decodedUser = jsonWebToken.verifyJWT(token, config.tokenSecret) as JwtPayload;
            if (!decodedUser) throw new UnauthorizedRequestError(API_ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);

            req.userId = decodedUser.userId;

            return next();
        } catch (error) {
            throw new UnauthorizedRequestError(API_ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);
        }
    };
};
