import { Controller, Post, Body, Param, Delete, HttpStatus, Put } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AppResponse, COMMENT_MESSAGE } from "src/common";
import { IComment } from "./interface";

@Controller("comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(@Body() createCommentDto: CreateCommentDto): Promise<AppResponse<IComment>> {
        const userId = "userId";
        const comment = await this.commentService.addComment(userId, createCommentDto);
        return new AppResponse<IComment>(COMMENT_MESSAGE.COMMENT_CREATED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(comment);
    }

    @Put(":id")
    async updateComment(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<AppResponse<IComment>> {
        const userId = "userId";
        const comment = await this.commentService.updateComment(id, userId, updateCommentDto);
        return new AppResponse<IComment>(COMMENT_MESSAGE.COMMENT_UPDATED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(comment);
    }

    @Delete(":id")
    async deleteComment(@Param("id") id: string) {
        const userId = "userId";
        const comment = await this.commentService.deleteComment(id, userId);
        return new AppResponse<IComment>(COMMENT_MESSAGE.COMMENT_DELETED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(comment);
    }
}
