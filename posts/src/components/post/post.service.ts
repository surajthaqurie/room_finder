import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreatePostDto } from "./dto";
import { POST_MESSAGE } from "src/common";
import { Posts, Status } from "@prisma/client";

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {}

    async createPost(createPostDto: CreatePostDto): Promise<Posts> {
        const post = await this.prismaService.posts.create({ data: { ...createPostDto, userId: "userId" } });
        if (!post) throw new BadRequestException(POST_MESSAGE.POST_CREATE_FAIL);

        return post;
    }

    async getPosts(status: Status) {
        return this.prismaService.posts.findMany({ where: { status } });
    }

    async getCurrentUserPosts(userId: string, status: Status): Promise<Posts[]> {
        return this.prismaService.posts.findMany({ where: { userId, status } });
    }

    async getPost(id: string) {
        const post = await this.prismaService.posts.findUnique({ where: { id } });
        if (!post) throw new NotFoundException(POST_MESSAGE.POST_NOT_FOUND);

        return post;
    }

    async updatePost(id: string, updatePostDto: CreatePostDto, userId: string): Promise<Posts> {
        const post = await this.getPost(id);
        if (post.userId !== userId) throw new ForbiddenException(POST_MESSAGE.POST_UPDATE_FORBIDDEN);

        const updatePost = await this.prismaService.posts.update({ where: { id: post.id }, data: updatePostDto });
        if (!updatePost) throw new BadRequestException(POST_MESSAGE.POST_UPDATE_FAIL);

        return updatePost;
    }

    async changePostStatus(id: string, userId: string): Promise<Posts> {
        const post = await this.getPost(id);

        if (post.userId !== userId) throw new ForbiddenException(POST_MESSAGE.POST_CHANGE_STATUS_FORBIDDEN);
        const status = post.status === Status.AVAILABLE ? Status.CLOSED : Status.AVAILABLE;

        const updatedPost = await this.prismaService.posts.update({ where: { id: post.id }, data: { status } });
        if (!updatedPost) throw new BadRequestException(POST_MESSAGE.POST_STATUS_CHANGE_FAIL);

        return updatedPost;
    }

    async deletePost(id: string, userId: string): Promise<Posts> {
        const post = await this.getPost(id);

        if (post.userId !== userId) throw new ForbiddenException(POST_MESSAGE.POST_DELETED_FORBIDDEN);

        const deletePost = await this.prismaService.posts.delete({ where: { id: post.id } });
        if (!deletePost) throw new BadRequestException(POST_MESSAGE.POST_DELETE_FAIL);

        return deletePost;
    }
}
