import { Kafka, Message } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";

import { BaseProducer } from "src/utils/kafka/baseProducer";
import { KafkaService } from "src/utils/kafka/kafka.service";

// TODO: @injectable
export class UserProducer extends BaseProducer<{ data: Message[] }> {
    readonly topic = KAFKA_TOPIC.USER_CREATE;
    data: Message[];

    constructor(data: any, kafkaService: KafkaService) {
        const kafka = kafkaService.kafkaClient();
        super(kafka);

        this.data = [{ key: this.topic, value: JSON.stringify(data) }];
    }
}
