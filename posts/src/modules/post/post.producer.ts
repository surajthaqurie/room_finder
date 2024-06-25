import { Kafka } from "kafkajs";
import { BaseProducer } from "src/utils/kafka/baseProducer";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";

export class PostCreateProducer extends BaseProducer {
    readonly topic: KAFKA_TOPIC = KAFKA_TOPIC.POST_CREATE;

    constructor(readonly kafka: Kafka) {
        super(kafka);
    }
}
