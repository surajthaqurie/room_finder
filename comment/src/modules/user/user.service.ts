import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser } from "./interface";

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private readonly userModel: Model<IUser>) {}

    async validUser(id: string): Promise<IUser | null> {
        const logger = new Logger(UserService.name + "-validUser");
        try {
            return await this.userModel.findOne({ _id: id }).select("_id");
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    createUser(payload: IUser) {
        const logger = new Logger(UserService.name + "-createUser");
        try {
            const data = {
                _id: payload._id,
                firstName: payload.firstName,
                lastName: payload.lastName
            };
            return this.userModel.create({ data });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
