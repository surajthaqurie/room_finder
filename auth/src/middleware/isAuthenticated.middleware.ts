import { NextFunction, Request, Response } from "express";
import { API_ERROR_MESSAGE_CONSTANT } from "src/common/constant";
import { JsonWebToken, UnauthorizedResponse } from "src/utils";

export const isAuthenticate = (config: { tokenSecret: string }) => {
    const jsonWebToken = new JsonWebToken();

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            let token: string | undefined;

            token = (req.headers["Authorization"] as string) || req.headers["authorization"];
            if (!token) throw new UnauthorizedResponse(API_ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_USER_INVALID_TOKEN);

            token = token.replace("Bearer ", "");

            // Verify the token
            const user = jsonWebToken.verifyJWT(token, config.tokenSecret);
            console.log("🚀 ~ IsAuthenticate ~ return ~ user:", user);

            // Token is valid, proceed with the request
            // req.user = decoded;
            return next();
        } catch (error) {
            console.log("🚀 ~ return ~ error:", error);
            /*   if (error.name === "TokenExpiredError") {
            return sendUnAuthorizedError(res);
          } else {
            return next(error);
          } */

            return next(error);
        }
    };
};
