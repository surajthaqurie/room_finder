import { dotEnv } from "app-env-validation";

export const env = {
    appConfig: {
        PORT: dotEnv.PORT,
        APP_URL: dotEnv.APP_URL,
        NODE_ENV: dotEnv.NODE_ENV,
        APP_NAME: dotEnv.APP_NAME
    },
    dbConfig: {
        DATABASE_URL: dotEnv.DATABASE_URL
    },
    kafkaConfig: {
        KAFKA_HOST: dotEnv.KAFKA_HOST
    },
    jwtConfig: {
        JWT_SECRET: dotEnv.JWT_SECRET,
        JWT_EXPIRES: dotEnv.JWT_EXPIRES
    }
};
