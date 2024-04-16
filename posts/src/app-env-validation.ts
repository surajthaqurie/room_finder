import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';

enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
    DEBUG = 'debug'
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsString()
    @IsNotEmpty()
    PORT: string;

    @IsString()
    @IsNotEmpty()
    APP_URL: string;

    @IsString()
    @IsNotEmpty()
    APP_NAME: string;

    @IsString()
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsString()
    @IsNotEmpty()
    KAFKA_HOST: string;
}

export function validateEnv(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        for (let error of errors) {
            if (error.constraints) {
                const errorMessage = Object.values(error.constraints)[0];
                throw new Error(errorMessage + ' in the env file.');
            }
        }
    }

    return validatedConfig;
}
