import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema(
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
            ref: "User",
            required: true
        },
        postId: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    { timestamps: true }
);
