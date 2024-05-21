import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { JwtStrategyModule, KafkaModule, PrismaModule } from "./utils";
import { validateEnv } from "./app-env-validation";
import { PostModule } from "./modules/post/post.module";
import { UserModule } from "./modules/users/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env", validate: validateEnv }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // Time to live in MS
                limit: 10
            }
        ]),
        JwtStrategyModule,
        PrismaModule,
        PostModule,
        KafkaModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
