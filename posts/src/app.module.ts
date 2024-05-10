import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { KafkaModule, PrismaModule } from "./utils";
import { validateEnv } from "./app-env-validation";
import { PostModule } from "./components/post/post.module";
import { UserModule } from "./components/users/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env", validate: validateEnv }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // Time to live in MS
                limit: 10
            }
        ]),
        PrismaModule,
        PostModule,
        KafkaModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
