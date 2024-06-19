import { Document } from "mongoose";
import { PostStatus } from "../enum";

export interface IPost extends Document {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    status: PostStatus;
    ownerId: string;
    updatedAt: Date;
    createdAt: Date;
}
