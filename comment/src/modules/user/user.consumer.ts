import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";
import { BaseConsumer } from "src/utils/kafka/baseConsumer";
import { BaseAdminTopic } from "src/utils/kafka/baseKafkaAdmin";
import { IUser } from "./interface";
import { UserService } from "./user.service";

class CommentCreateUserTopic extends BaseAdminTopic {
    topic: KAFKA_TOPIC = KAFKA_TOPIC.USER_CREATE;
}

export class UserCreateConsumer extends BaseConsumer<{ data: IUser }> implements OnModuleInit, OnModuleDestroy {
    groupId: string = "CommentCreateUserGroup";
    topic: KAFKA_TOPIC = KAFKA_TOPIC.USER_CREATE;

    private readonly topicCreator: CommentCreateUserTopic;

    constructor(
        kafka: Kafka,
        private readonly userService: UserService
    ) {
        super(kafka);
        this.topicCreator = new CommentCreateUserTopic(kafka);
    }

    async onMessage(value: IUser): Promise<void> {
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
