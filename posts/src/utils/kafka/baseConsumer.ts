import { Consumer, Kafka } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";

export abstract class BaseConsumer<T extends { data: Record<string, any> | any }> {
    abstract topic: KAFKA_TOPIC;
    abstract groupId: string;
    private readonly kafkaClient: Kafka;
    private consumer: Consumer;

    abstract onMessage(value: T["data"]): Promise<void>;

    constructor(kafkaClient: Kafka) {
        this.kafkaClient = kafkaClient;
    }

    async listener() {
        try {
            this.consumer = this.kafkaClient.consumer({ groupId: this.groupId });
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    if (message.value) {
                        const value = message.value.toString();
                        console.log("Kafka consumer called by ::::: " + topic);
                        this.onMessage(JSON.parse(value));
                    }
                }
            });
        } catch (error) {
            console.log("Error on kafka Consumer", error);
        }
    }

    async stopListener() {
        await this.consumer.disconnect();
    }
}

/* 
import { OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { logger } from "@vedastudios/chat-app"
import { BadRequestError, BaseAdminClient, BaseConsumer, ConsumerEventPayload, KAKFA_EVENT } from "@vedastudios/shared"
import { Kafka } from "kafkajs"

import { TOPIC } from "./topic.enum"
import { UserPayload } from "./user.interface"
import { UsersService } from "./users.service"

class AuthUserTopicCreator extends BaseAdminClient {
  readonly topic = TOPIC.AUTH_USER
}

export class AuthUserConsumer extends BaseConsumer<UserPayload[]> implements OnModuleInit, OnModuleDestroy {
  readonly groupId = "admin-auth_user"
  readonly topic = TOPIC.AUTH_USER

  private readonly topicCreator: AuthUserTopicCreator

  constructor(
    kafka: Kafka,
    private readonly service: UsersService
  ) {
    super(kafka)
    this.topicCreator = new AuthUserTopicCreator(this.kafka)
  }

  async onMessage(payload: ConsumerEventPayload<UserPayload[]>): Promise<void> {
    try {
      if (payload.event === KAKFA_EVENT.CREATED || payload.event === KAKFA_EVENT.UPDATED) {
        await this.service.consume(payload.data)
        logger.info("Consumed auth user")
      }
    } catch (error) {
      logger.error("Error while consuming auth user data from kafka", error)
      throw new BadRequestError((error as Error).message)
    }
  }

  onModuleInit() {
    this.topicCreator.createTopicIfNotExists(2)
    this.listen()
  }

  onModuleDestroy() {
    this.stopConsumer()
  }
}



*/
