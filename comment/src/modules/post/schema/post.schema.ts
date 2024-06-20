import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { PostStatus } from "../enum";
import { NextFunction } from "express";
import { IPost } from "../interface";

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: String, trim: true, required: true })
    title: string;

    @Prop({ type: String, trim: true, required: true })
    description: string;

    @Prop({ type: String, trim: true, required: true })
    imageUrl: string;

    @Prop({ type: String, trim: true, required: true })
    location: string;

    @Prop({ type: PostStatus, trim: true, required: true })
    status: PostStatus;

    @Prop({ type: mongoose.Types.ObjectId, ref: "User", trim: true, required: true })
    owner: string;

    @Prop([{ type: mongoose.SchemaTypes.ObjectId, ref: "Comment" }])
    comments: mongoose.Types.ObjectId[];
}

const PostSchema = SchemaFactory.createForClass<Post>(Post);
PostSchema.pre("save", async function (this: IPost, next: NextFunction) {
    let post = this;

    post.slug = post.title
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\w-]+/g, "");

    next();
});

export { PostSchema };
