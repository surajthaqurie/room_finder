import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";
import { BaseConsumer } from "src/utils/kafka/baseConsumer";
import { BaseAdminTopic } from "src/utils/kafka/baseKafkaAdmin";
import { IUserCreate } from "./Interfaces/user.interface";
import { UserService } from "./user.service";

class PostCreateUserTopic extends BaseAdminTopic {
    readonly topic = KAFKA_TOPIC.USER_CREATE;
}

export class UserCreateConsumer extends BaseConsumer<{ data: IUserCreate }> implements OnModuleInit, OnModuleDestroy {
    groupId: string = "PostCreateUser";
    topic = KAFKA_TOPIC.USER_CREATE;
    private readonly topicCreator: PostCreateUserTopic;

    constructor(
        kafka: Kafka,
        private userService: UserService
    ) {
        super(kafka);
        this.topicCreator = new PostCreateUserTopic(kafka);
    }

    async onMessage(value: IUserCreate): Promise<void> {
        await this.userService.createUser(value);
    }

    async onModuleInit() {
        await this.topicCreator.createTopicIfNotExits(2);
        await this.listener();
    }

    async onModuleDestroy() {
        await this.stopListener();
    }
}
