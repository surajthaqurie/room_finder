import { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    isDeleted: boolean;
    updatedAt: Date;
    createdAt: Date;
}
