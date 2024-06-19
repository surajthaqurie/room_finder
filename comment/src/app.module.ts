import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { validateEnv } from "./app-env-validation";
import { ThrottlerModule } from "@nestjs/throttler";
import { CommentModule } from "./modules/comment/comment.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env", validate: validateEnv }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("DATABASE_URL")
            }),
            inject: [ConfigService]
        }),

        ThrottlerModule.forRoot([
            {
                ttl: 60000, // Time to live in MS
                limit: 10
            }
        ]),
        CommentModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
