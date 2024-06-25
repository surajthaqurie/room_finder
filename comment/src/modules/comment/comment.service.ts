import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateCommentDto, UpdateCommentDto } from "./dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IComment } from "./interface";
import { COMMENT_MESSAGE } from "src/common";
import { PostService } from "../post/post.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel("Comment") private readonly commentModel: Model<IComment>,
        private readonly postService: PostService
    ) {}

    async addComment(authorId: string, payload: CreateCommentDto): Promise<IComment> {
        const logger = new Logger(CommentService.name + "-addComment");
        try {
            const post = await this.postService.validPost(payload.postId);

            const comment = await this.commentModel.create({ ...payload, authorId });
            if (!comment) throw new BadRequestException(COMMENT_MESSAGE.COMMENT_CREATE_FAIL);

            await this.postService.addComment(post._id, comment._id);
            return comment;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateComment(id: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<IComment> {
        const logger = new Logger(CommentService.name + "-updateComment");
        try {
            const comment = await this.commentModel.findOne({ _id: id });
            if (!comment) throw new NotFoundException(COMMENT_MESSAGE.COMMENT_RECORD_NOT_FOUND);
            if (comment.authorId !== userId) throw new ForbiddenException(COMMENT_MESSAGE.COMMENT_UPDATE_FORBIDDEN);

            const updateComment = await this.commentModel.findByIdAndUpdate({ _id: comment._id }, { content: updateCommentDto }, { new: true, useFindAndModify: false });
            if (!updateComment) throw new BadRequestException(COMMENT_MESSAGE.COMMENT_UPDATE_FAIL);

            return updateComment;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async deleteComment(id: string, userId: string): Promise<IComment> {
        const logger = new Logger(CommentService.name + "-deleteComment");
        try {
            const comment = await this.commentModel.findOne({ _id: id });
            if (!comment) throw new NotFoundException(COMMENT_MESSAGE.COMMENT_RECORD_NOT_FOUND);
            if (comment.authorId !== userId) throw new ForbiddenException(COMMENT_MESSAGE.COMMENT_UPDATE_FORBIDDEN);

            const deletedComment = await this.commentModel.findByIdAndDelete(comment._id);
            if (!deletedComment) throw new BadRequestException(COMMENT_MESSAGE.COMMENT_DELETE_FAIL);

            await this.postService.addComment(deletedComment._id, comment._id);
            return deletedComment;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
