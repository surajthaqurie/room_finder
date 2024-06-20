import { Controller, Post, Body, Param, Delete, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AppResponse, COMMENT_MESSAGE } from "src/common";
import { IComment } from "./interface";
import { getUserId } from "src/utils/decorators";
import { isAuthenticate } from "src/utils/guards";

@Controller("comment")
@UseGuards(isAuthenticate)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @getUserId() currentUser: { id: string }): Promise<AppResponse<IComment>> {
        const comment = await this.commentService.addComment(currentUser.id, createCommentDto);
        return new AppResponse<IComment>(COMMENT_MESSAGE.COMMENT_CREATED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(comment);
    }

    @Put(":id")
    async updateComment(@Param("id") id: string, @getUserId() currentUser: { id: string }, @Body() updateCommentDto: UpdateCommentDto): Promise<AppResponse<IComment>> {
        const comment = await this.commentService.updateComment(id, currentUser.id, updateCommentDto);
        return new AppResponse<IComment>(COMMENT_MESSAGE.COMMENT_UPDATED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(comment);
    }

    @Delete(":id")
    async deleteComment(@Param("id") id: string, @getUserId() currentUser: { id: string }) {
        const comment = await this.commentService.deleteComment(id, currentUser.id);
        return new AppResponse<IComment>(COMMENT_MESSAGE.COMMENT_DELETED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(comment);
    }
}
