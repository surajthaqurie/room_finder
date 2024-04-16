import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as morgan from "morgan";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { AppExceptionFilter, PrismaExceptionFilter } from "./common/filters";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.use(morgan("dev"));
    app.setGlobalPrefix("api/v1");
    app.enableCors({ origin: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    //Error-exception as global filter
    app.useGlobalFilters(new PrismaExceptionFilter());
    app.useGlobalFilters(new AppExceptionFilter());

    const configService = app.get(ConfigService);

    const PORT = configService.get<string>("PORT") || 4003;
    const APP_URL = configService.get<string>("APP_URL");

    await app.listen(PORT, () => {
        console.log(`Server is starting on ${APP_URL} at ${new Date()} with process id:`, process.pid);
    });

    process.on("SIGTERM", (): void => {
        console.log("Server is closing at ", new Date());
        app.close();
    });

    process.on("SIGINT", (): void => {
        console.log("Server is closing at ", new Date());
        app.close();
    });
}
bootstrap();
