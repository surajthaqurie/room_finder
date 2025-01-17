import Joi from "joi";

interface IEnvironment {
    NODE_ENV: string;
    PORT: number;
    APP_URL: string;
    APP_NAME: string;
    DATABASE_URL: string;
    KAFKA_HOST: string;
    JWT_SECRET: string;
    JWT_EXPIRES: string;
}

export const envValidationSchema = Joi.object<IEnvironment, true>({
    NODE_ENV: Joi.string().required().trim().valid("development", "production", "test", "debug"),
    PORT: Joi.number().required(),
    APP_URL: Joi.string().required().trim(),
    APP_NAME: Joi.string().required().trim(),
    DATABASE_URL: Joi.string().required().trim(),
    KAFKA_HOST: Joi.string().required().trim(),
    JWT_SECRET: Joi.string().required().trim(),
    JWT_EXPIRES: Joi.string().required().trim()
}).unknown();

const { error, value: dotEnv } = envValidationSchema.validate(process.env) as { error: Joi.ValidationError | undefined; value: IEnvironment };

if (error) throw new Error(`Config validation error: ${error.message}`);

export { dotEnv };
