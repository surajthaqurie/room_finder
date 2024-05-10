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
