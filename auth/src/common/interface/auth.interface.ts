import { Document } from "mongoose";

export interface IAuthDocument extends Document {
    username: string;
    email: string;
    password: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILoginPayload {
    email: string;
    password?: string;
}

export interface ISignupPayload extends ILoginPayload {
    firstName: string;
    lastName: string;
    address: string;
    username: string;
    confirmPassword?: string;
}

export interface IAuthUpdatePayload {
    id: string;
    username: string;
    email: string;
}

export interface IAuthRegister {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    address: string;
}

export interface ISignupResponse {
    _id: string;
    email: string;
    username: string;
}
