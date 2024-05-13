import jwt from "jsonwebtoken";
import { env } from "src/configs";

export class JsonWebToken {
    generateJWT() {
        try {
            return jwt.sign(
                {
                    user: "userInfo.id",
                    role: "userInfo.role"
                },
                process.env.JWT_SECRET as string,
                {
                    algorithm: "HS256",
                    issuer: env.appConfig.APP_URL as string,
                    expiresIn: process.env.JWT_EXPIRES as string
                }
            );
        } catch (error) {
            throw error;
        }
    }

    verifyJWT() {
        try {
        } catch (error) {
            throw error;
        }
    }

    decodeJwt() {
        try {
        } catch (error) {
            throw error;
        }
    }
}
