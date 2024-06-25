import { BaseConsumer } from "src/utils/kafka/baseConsumer";
import { IPostCreate } from "./interface";
import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { BaseAdminTopic } from "src/utils/kafka/baseKafkaAdmin";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";
import { Kafka } from "kafkajs";
import { PostService } from "./post.service";

class CommentCreatePostTopic extends BaseAdminTopic {
    topic: KAFKA_TOPIC = KAFKA_TOPIC.POST_CREATE;
}

export class PostCreateConsumer extends BaseConsumer<{ data: IPostCreate }> implements OnModuleInit, OnModuleDestroy {
    groupId: string = "CommentCreatePostGroup";
    topic: KAFKA_TOPIC = KAFKA_TOPIC.POST_CREATE;

    private readonly topicCreator: CommentCreatePostTopic;

    constructor(
        kafka: Kafka,
        private readonly postService: PostService
    ) {
        super(kafka);
        this.topicCreator = new CommentCreatePostTopic(kafka);
    }

    async onMessage(value: IPostCreate): Promise<void> {
        await this.postService.createPost(value);
    }

    async onModuleInit() {
        await this.topicCreator.createTopicIfNotExits(2);
        await this.listener();
    }

    async onModuleDestroy() {
        await this.stopListener();
    }
}
