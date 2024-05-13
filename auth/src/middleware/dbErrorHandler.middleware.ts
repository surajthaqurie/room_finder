import { BadRequestError } from "@node_helper/error-handler";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const dbErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 11000) {
        const name = Object.keys(err.keyValue)[0];
        let message = `This '${err.keyValue[name]}' was already taken. Please choose different ${name}.`;
        return next(new BadRequestError(message));
    }

    if (err instanceof mongoose.Error.CastError) {
        const message = `Invalid value for ${err.path}: ${err.value}!`;
        return next(new BadRequestError(message));
    }

    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((val) => val.message);
        const errorMessages = errors.join(". ");
        const message = `Invalid input data: ${errorMessages}`;
        return next(new BadRequestError(message));
    }

    return next(err);
};
