import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategyService } from "./jwtStrategy.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "src/modules/user/user.module";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: configService.get<string>("JWT_EXPIRES") }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [JwtStrategyService]
})
export class JwtStrategyModule {}
