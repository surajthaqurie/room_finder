import { Document } from "mongoose";
import { PostStatus } from "../enum";

export interface IPost extends Document {
    _id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    status: PostStatus;
    owner: string;
    comments: string[];
    updatedAt: Date;
    createdAt: Date;
}
