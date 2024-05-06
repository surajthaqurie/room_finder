import { Kafka } from "kafkajs";
import { KAFKA_TOPIC } from "src/common/enum";

export abstract class BaseConsumer<T extends { data: Record<string, any> | any }> {
    abstract topic: KAFKA_TOPIC;
    abstract groupId: string;
    private readonly kafkaClient: Kafka;
}
