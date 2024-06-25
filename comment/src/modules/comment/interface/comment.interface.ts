import { Document } from "mongoose";

export interface IComment extends Document {
    _id: string;
    content: string;
    isDeleted: boolean;
    authorId: string;
    postId: string;
    updatedAt: Date;
    createdAt: Date;
}
