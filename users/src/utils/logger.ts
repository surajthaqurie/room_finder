import { env } from "src/configs";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const Logger = class AppLogger {
    static getLogger = (service = "AppLogger") => {
        const logger = createLogger({
            level: env.appConfig.NODE_ENV === "development" ? "debug" : "info",
            exitOnError: false,
            defaultMeta: { service: [service] },
            format: format.combine(
                format.timestamp(),
                format.ms(),
                format.errors()
                //format.logstash()
            ),
            transports: [
                new transports.Console({
                    format: format.combine(format.colorize({ all: true }), format.simple())
                }),
                AppLogger.httpTransport(),
                AppLogger.infoTransport(),
                AppLogger.errorTransport()
            ]

            // exceptionHandlers: [new transports.File({ filename: '../logs/exceptions.log' })],
            // rejectionHandlers: [new transports.File({ filename: '../logs/rejections.log' })],
        });

        return logger;
    };

    static httpTransport() {
        const httpFilter = format((log, opts) => (log.level === "http" ? log : false));
        return new DailyRotateFile({
            filename: "../logs/http-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            zippedArchive: true,
            auditFile: "../logs/http-audit.json",
            maxSize: "2m",
            maxFiles: "1d",
            level: "http",
            format: format.combine(httpFilter(), format.timestamp(), format.json())
        });
    }

    static infoTransport() {
        const infoFilter = format((log, opts) => (log.level === "info" ? log : false));
        return new DailyRotateFile({
            level: "info",
            filename: "../logs/info-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            auditFile: "../logs/info-audit.json",
            zippedArchive: true,
            maxSize: "2m",
            maxFiles: "1d",
            format: format.combine(infoFilter(), format.timestamp(), format.json())
        });
    }

    static errorTransport() {
        const errorFilter = format((log, opts) => (log.level === "error" ? log : false));
        return new DailyRotateFile({
            level: "error",
            filename: "../logs/error-%DATE%.log",
            datePattern: "DD-MM-YYYY",
            auditFile: "../logs/error-audit.json",
            zippedArchive: true,
            handleExceptions: true,
            handleRejections: true,
            maxSize: "2m",
            maxFiles: "1d",
            format: format.combine(errorFilter(), format.timestamp(), format.json())
        });
    }
}.getLogger;

// https://dev.to/adeyemiadekore2/file-logging-in-nodejs-5e8l
// https://www.packmind.com/access-logs-nodejs-winston-morgan-storage-elasticsearch/
// https://mirzaleka.medium.com/automated-logging-in-express-js-a1f85ca6c5cd
