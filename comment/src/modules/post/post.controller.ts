import { Controller, Get, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { PostService } from "./post.service";
import { AppResponse, POST_MESSAGE } from "src/common";
import { IPost } from "./interface";

@Controller("comment/post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    async getPostDetails(@Param("id") id: string): Promise<AppResponse<IPost>> {
        const posts = await this.postService.getPostDetails(id);
        return new AppResponse<IPost>(POST_MESSAGE.POSTS_FETCHED_SUCCESS).setStatus(HttpStatus.OK).setSuccessData(posts);
    }
}
