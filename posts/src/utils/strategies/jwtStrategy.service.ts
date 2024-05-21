import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ERROR_MESSAGE_CONSTANT } from "src/common/messages/common.message";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService
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
            const user = await this.prismaService.user.findUnique({
                where: { id: payload.userId },
                select: { id: true }
            });

            if (!user) throw new UnauthorizedException(ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);

            return user;
        } catch (err) {
            logger.error(err);
            throw new UnauthorizedException(ERROR_MESSAGE_CONSTANT.UNAUTHORIZED_INVALID_TOKEN);
        }
    }
}
