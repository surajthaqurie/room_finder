import { Kafka, Partitioners, Producer } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";
import { IMessagePayload } from "./interfaces";

export abstract class BaseProducer {
    abstract topic: KAFKA_TOPIC;

    private readonly producer: Producer;

    constructor(kafkaClient: Kafka) {
        this.producer = kafkaClient.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    }

    async connect() {
        try {
            await this.producer.connect();
        } catch (error) {
            console.log("Error while connecting to kafka", error);
        }
    }

    async disconnect() {
        await this.producer.disconnect();
    }

    async produce<T>(payload: IMessagePayload<T>) {
        try {
            await this.connect();

            const { key, ...rest } = payload;

            await this.producer.send({
                topic: this.topic,
                messages: [{ key: key, value: JSON.stringify(rest) }]
            });

            console.log("Kafka producer called by ::::: " + this.topic);
        } catch (error) {
            console.log("Error on kafka producer", error);
        } finally {
            await this.disconnect();
        }
    }
}
