import mongoose from "mongoose";
import { IComment } from "../interface";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        authorId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        postId: {
            type: mongoose.Types.ObjectId,
            ref: "Post"
        }
    },
    { timestamps: true }
);

export const Auth = mongoose.model<IComment>("comment", commentSchema);
