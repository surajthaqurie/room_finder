import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UtilsModule } from './utils/utils.module';
import { validateEnv } from './app-env-validation';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', validate: validateEnv }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // Time to live in MS
                limit: 10
            }
        ]),
        UtilsModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
