import { Message } from "kafkajs";
import mongoose from "mongoose";
import { KAFKA_TOPIC } from "src/common/enum";
import { BaseProducer, kafkaClient } from "src/utils";

export class UserUpdateProducer extends BaseProducer<{ data: Message[] }> {
    topic: KAFKA_TOPIC = KAFKA_TOPIC.USER_UPDATE;
    data: Message[];

    constructor(data: { id: mongoose.Types.ObjectId; email: string; username: string }) {
        super(kafkaClient);
        this.data = [{ key: this.topic, value: JSON.stringify(data) }];
    }
}

export class UserEnableDisableProducer extends BaseProducer<{ data: Message[] }> {
    topic: KAFKA_TOPIC = KAFKA_TOPIC.USER_ENABLE_DISABLE;
    data: Message[];

    constructor(data: string) {
        super(kafkaClient);
        this.data = [{ key: this.topic, value: JSON.stringify(data) }];
    }
}

export class UserDeleteProducer extends BaseProducer<{ data: Message[] }> {
    topic: KAFKA_TOPIC = KAFKA_TOPIC.USER_DELETE;
    data: Message[];

    constructor(data: string) {
        super(kafkaClient);
        this.data = [{ key: this.topic, value: JSON.stringify(data) }];
    }
}
