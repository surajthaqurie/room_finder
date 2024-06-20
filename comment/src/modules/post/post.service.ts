import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPost } from "./interface";
import { POST_MESSAGE } from "src/common";

@Injectable()
export class PostService {
    constructor(@InjectModel("Post") private readonly postModel: Model<IPost>) {}

    async validPost(postId: string): Promise<IPost> {
        const logger = new Logger(PostService.name + "-validPost");
        try {
            const post = await this.postModel.findOne({ $or: [{ _id: postId }, { slug: postId }] });
            if (!post) throw new NotFoundException(POST_MESSAGE.POST_RECORD_NOT_FOUND);

            return post;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getPostDetails(postId: string): Promise<IPost> {
        const logger = new Logger(PostService.name + "-getPostDetails");
        try {
            // Check the post is valid or not
            let populateQuery = [
                { path: "owner", select: "firstName lastName isActive" },
                {
                    path: "comments",
                    populate: {
                        path: "authorId",
                        select: "firstName lastName isActive"
                    }
                }
            ];

            const post = await this.postModel
                .findOne({ $or: [{ _id: postId }, { slug: postId }] })
                .populate(populateQuery)
                .exec();
            if (!post) throw new NotFoundException(POST_MESSAGE.POST_RECORD_NOT_FOUND);

            return post;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async addComment(postId: string, commentId: string): Promise<IPost> {
        const logger = new Logger(PostService.name + "-addComment");
        try {
            const comment = await this.postModel.findByIdAndUpdate(
                postId,
                {
                    $push: { comments: commentId }
                },
                { new: true, useFindAndModify: false }
            );

            if (!comment) throw new BadRequestException(POST_MESSAGE.UNABLE_ADD_COMMENT);

            return comment;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
