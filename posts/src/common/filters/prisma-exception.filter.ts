import { ArgumentsHost, Catch, HttpStatus, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { ERROR_MESSAGE_CONSTANT } from "../messages";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest<Request>();

        const method = request.method;
        const url = request.url;
        const now = Date.now();

        const name = exception.meta?.column || exception.meta?.target;
        const responseJson = {
            success: false,
            message: ERROR_MESSAGE_CONSTANT.INTERNAL_SERVER_ERROR,
            status: HttpStatus.INTERNAL_SERVER_ERROR
        };
        switch (exception.code) {
            case "P2002":
                responseJson["message"] = `This ${name} already exists. Please choose different ${name}`;
                responseJson["status"] = HttpStatus.BAD_REQUEST;

                response.status(HttpStatus.BAD_REQUEST).json(responseJson);
                break;

            case "P2014":
                responseJson["message"] = `Invalid ID: ${name}`;
                responseJson["status"] = HttpStatus.BAD_REQUEST;

                response.status(HttpStatus.BAD_REQUEST).json(responseJson);
                break;

            case "P2006":
                responseJson["message"] = `The provide value for ${name} is invalid`;
                responseJson["status"] = HttpStatus.BAD_REQUEST;

                response.status(HttpStatus.BAD_REQUEST).json(responseJson);
                break;

            case "P2022":
                responseJson["message"] = `Column ${name} doesn't exist on database table`;
                responseJson["status"] = HttpStatus.BAD_REQUEST;

                response.status(HttpStatus.BAD_REQUEST).json(responseJson);
                break;

            default:
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseJson);
                break;
        }

        Logger.error(`${method} ${url} ${Date.now() - now}ms ${JSON.stringify(responseJson)}`, PrismaExceptionFilter.name);
    }
}
