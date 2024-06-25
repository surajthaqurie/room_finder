import { KAFKA_TOPIC } from "src/utils/kafka/enums";

import { BaseProducer } from "src/utils/kafka/baseProducer";
import { KafkaService } from "src/utils/kafka/kafka.service";

export class UserProducer extends BaseProducer {
    readonly topic = KAFKA_TOPIC.USER_CREATE;

    constructor(kafkaService: KafkaService) {
        const kafka = kafkaService.kafkaClient();
        super(kafka);
    }
}
