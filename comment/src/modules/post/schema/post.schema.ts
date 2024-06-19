import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { PostStatus } from "../enum";

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
    ownerId: string;
}

export const PostSchema = SchemaFactory.createForClass<Post>(Post);
