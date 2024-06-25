import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreatePostDto } from "./dto";
import { POST_MESSAGE } from "src/common";
import { Posts, Status } from "@prisma/client";
import { PostCreateProducer } from "./post.producer";
import { KAFKA_EVENT, KAFKA_TOPIC } from "src/utils/kafka/enums";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly postCreateProducer: PostCreateProducer
    ) {}

    async createPost(createPostDto: CreatePostDto, userId: string): Promise<Posts> {
        const logger = new Logger(PostService.name + "-createPost");
        try {
            return this.prismaService.$transaction(async (tx) => {
                const post = await this.prismaService.posts.create({ data: { ...createPostDto, userId } });
                if (!post) throw new BadRequestException(POST_MESSAGE.POST_CREATE_FAIL);

                await this.postCreateProducer.produce({
                    data: [post],
                    event: KAFKA_EVENT.CREATED,
                    key: KAFKA_TOPIC.POST_CREATE
                });

                return post;
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getPosts(status: Status): Promise<Posts[]> {
        const logger = new Logger(PostService.name + "-getPosts");
        try {
            if (status && Object.values(Status).indexOf(status) == -1) throw new BadRequestException(POST_MESSAGE.INVALID_STATUS);
            return this.prismaService.posts.findMany({ where: { status } });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getCurrentUserPosts(userId: string, status: Status): Promise<Posts[]> {
        const logger = new Logger(PostService.name + "-getCurrentUserPosts");
        try {
            if (status && Object.values(Status).indexOf(status) == -1) throw new BadRequestException(POST_MESSAGE.INVALID_STATUS);
            return this.prismaService.posts.findMany({ where: { userId, status } });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async getPost(id: string): Promise<Posts> {
        const logger = new Logger(PostService.name + "-getPost");
        try {
            const post = await this.prismaService.posts.findUnique({ where: { id } });
            if (!post) throw new NotFoundException(POST_MESSAGE.POST_NOT_FOUND);

            return post;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updatePost(id: string, updatePostDto: CreatePostDto, userId: string): Promise<Posts> {
        const logger = new Logger(PostService.name + "-updatePost");
        try {
            const post = await this.getPost(id);
            if (post.userId !== userId) throw new ForbiddenException(POST_MESSAGE.POST_UPDATE_FORBIDDEN);

            const updatePost = await this.prismaService.posts.update({ where: { id: post.id }, data: updatePostDto });
            if (!updatePost) throw new BadRequestException(POST_MESSAGE.POST_UPDATE_FAIL);

            return updatePost;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async changePostStatus(id: string, userId: string): Promise<Posts> {
        const logger = new Logger(PostService.name + "-changePostStatus");
        try {
            const post = await this.getPost(id);

            if (post.userId !== userId) throw new ForbiddenException(POST_MESSAGE.POST_CHANGE_STATUS_FORBIDDEN);
            const status = post.status === Status.AVAILABLE ? Status.CLOSED : Status.AVAILABLE;

            const updatedPost = await this.prismaService.posts.update({ where: { id: post.id }, data: { status } });
            if (!updatedPost) throw new BadRequestException(POST_MESSAGE.POST_STATUS_CHANGE_FAIL);

            return updatedPost;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async deletePost(id: string, userId: string): Promise<Posts> {
        const logger = new Logger(PostService.name + "-deletePost");
        try {
            const post = await this.getPost(id);

            if (post.userId !== userId) throw new ForbiddenException(POST_MESSAGE.POST_DELETED_FORBIDDEN);

            const deletePost = await this.prismaService.posts.delete({ where: { id: post.id } });
            if (!deletePost) throw new BadRequestException(POST_MESSAGE.POST_DELETE_FAIL);

            return deletePost;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
