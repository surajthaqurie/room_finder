import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { AppResponse, POST_MESSAGE } from "src/common";
import { Posts, Status } from "@prisma/client";
import { isAuthenticate } from "src/utils/guards";
import { getUserId } from "src/utils/decorators";

@Controller("post")
@UseGuards(isAuthenticate)
export class PostController {
    constructor(private postService: PostService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() createPostDto: CreatePostDto, @getUserId() currentUser: { id: string }): Promise<AppResponse<Posts>> {
        const post = await this.postService.createPost(createPostDto, currentUser.id);
        return new AppResponse<Posts>(POST_MESSAGE.POST_CREATED_SUCCESS).setStatus(HttpStatus.CREATED).setSuccessData(post);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getPosts(@Query("status") status: Status): Promise<AppResponse<Posts[]>> {
        const posts = await this.postService.getPosts(status);
        return new AppResponse<Posts[]>(POST_MESSAGE.POSTS_FETCHED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(posts);
    }

    @HttpCode(HttpStatus.OK)
    @Get("/mine")
    async getCurrentUserPosts(@Query("status") status: Status, @getUserId() currentUser: { id: string }): Promise<AppResponse<Posts[]>> {
        const posts = await this.postService.getCurrentUserPosts(currentUser.id, status);
        return new AppResponse<Posts[]>(POST_MESSAGE.POSTS_FETCHED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(posts);
    }

    @Get(":id")
    async getPost(@Param("id") id: string): Promise<AppResponse<Posts>> {
        const post = await this.postService.getPost(id);
        return new AppResponse<Posts>(POST_MESSAGE.POST_DETAIL_FETCHED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(post);
    }

    @Put(":id")
    async updatePost(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto, @getUserId() currentUser: { id: string }): Promise<AppResponse<Posts>> {
        const post = await this.postService.updatePost(id, updatePostDto, currentUser.id);
        return new AppResponse<Posts>(POST_MESSAGE.POST_UPDATED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(post);
    }

    @Patch(":id")
    async changePostStatus(@Param("id") id: string, @getUserId() currentUser: { id: string }): Promise<AppResponse<Posts>> {
        const post = await this.postService.changePostStatus(id, currentUser.id);
        return new AppResponse<Posts>(POST_MESSAGE.POST_STATUS_CHANGED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(post);
    }

    @Delete(":id")
    async deletePostS(@Param("id") id: string, @getUserId() currentUser: { id: string }): Promise<AppResponse<Posts>> {
        const post = await this.postService.deletePost(id, currentUser.id);
        return new AppResponse<Posts>(POST_MESSAGE.POST_DELETED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(post);
    }
}
