import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ERROR_MESSAGE_CONSTANT } from "src/common/messages/common.message";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET")
        });
    }

    async validate(payload: { userId: string }): Promise<{ id: string }> {
        const logger = new Logger(JwtStrategyService.name + "-validate");
        try {
            const validUser = await this.userService.validUser(payload.userId);

            if (!validUser) throw new UnauthorizedException(ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);
            return { id: validUser._id };
        } catch (err) {
            logger.error(err);
            throw new UnauthorizedException(ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);
        }
    }
}
