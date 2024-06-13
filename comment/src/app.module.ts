import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./app-env-validation";
import { ThrottlerModule } from "@nestjs/throttler";
import { CommentModule } from "./modules/comment/comment.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env", validate: validateEnv }),
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
