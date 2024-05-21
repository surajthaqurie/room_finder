import jwt from "jsonwebtoken";
import { Logger } from "./logger";

export class JsonWebToken {
    generateJWT(jwtPayload: { id: string }, JWT_SECRET: string, JWT_EXPIRES: string, APP_URL: string) {
        const logger = Logger(JsonWebToken.name + "-generateJWT");
        try {
            return jwt.sign(
                {
                    userId: jwtPayload.id
                },
                JWT_SECRET,
                {
                    algorithm: "HS256",
                    issuer: APP_URL,
                    expiresIn: JWT_EXPIRES
                }
            );
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    verifyJWT(token: string, JWT_SECRET: string) {
        const logger = Logger(JsonWebToken.name + "-verifyJWT");
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    decodeJwt(token: string) {
        const logger = Logger(JsonWebToken.name + "-decodeJwt");
        try {
            return jwt.decode(token);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}
