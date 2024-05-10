import { Injectable, Logger } from "@nestjs/common";
import { IUserCreate } from "./Interfaces/user.interface";
import { PrismaService } from "src/utils/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    createUser(payload: IUserCreate) {
        const logger = new Logger(UserService.name + "-createUser");
        try {
            const data = {
                id: payload._id,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName
            };
            return this.prismaService.user.create({ data });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
