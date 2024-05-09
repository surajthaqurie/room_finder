import { Kafka, Message } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";

import { BaseProducer } from "src/utils/kafka/baseProducer";
import { KafkaService } from "src/utils/kafka/kafka.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserProducer extends BaseProducer<{ data: Message[] }> {
    readonly topic = KAFKA_TOPIC.USER_CREATE;
    data: Message[];

    constructor(data: any, kafkaService: KafkaService) {
        const kafka = kafkaService.kafkaClient();
        super(kafka);

        this.data = [{ key: this.topic, value: JSON.stringify(data) }];
    }
}

/* 
import { KafkaProducerService } from 'src/utilities/kafka/kafka.producer.service';

export class AuthProducer extends BaseProducer {
    readonly topic = KAFKA_TOPIC.USER_CREATE;
  constructor(readonly kafka: Kafka) {
    super(kafka);
  }
}
*/
