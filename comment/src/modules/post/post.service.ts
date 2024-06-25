import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPost, IPostCreate } from "./interface";
import { POST_MESSAGE, USER_MESSAGE } from "src/common";
import { UserService } from "../user/user.service";

@Injectable()
export class PostService {
    constructor(
        @InjectModel("Post") private readonly postModel: Model<IPost>,
        private readonly userService: UserService
    ) {}

    async createPost(payload: IPostCreate) {
        const logger = new Logger(PostService.name + "-createPost");
        try {
            const user = await this.userService.validUser(payload.userId);
            if (!user) throw new BadRequestException(USER_MESSAGE.USER_NOT_FOUND);

            const post = await this.postModel.findOne({ _id: payload });
            if (post) throw new ConflictException(POST_MESSAGE.POST_ALREADY_EXIST);

            await this.postModel.create({ ...payload });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

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
                    options: { sort: { createdAt: 1 } },
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
            const post = await this.postModel.findByIdAndUpdate(
                postId,
                {
                    $push: { comments: commentId }
                },
                { new: true, useFindAndModify: false }
            );

            if (!post) throw new BadRequestException(POST_MESSAGE.UNABLE_TO_ADD_COMMENT);

            return post;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async removeComment(postId: string, commentId: string): Promise<IPost> {
        const logger = new Logger(PostService.name + "-removeComment");
        try {
            await this.validPost(postId);

            const post = await this.postModel.findByIdAndUpdate(
                postId,
                {
                    $pull: { comments: commentId }
                },
                { new: true, useFindAndModify: false }
            );

            if (!post) throw new BadRequestException(POST_MESSAGE.UNABLE_TO_REMOVE_COMMENT);

            return post;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
