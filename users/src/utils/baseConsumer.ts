import { Kafka } from "kafkajs";
import { KAFKA_TOPIC } from "src/common/enum";

export abstract class BaseConsumer<T extends { data: any }> {
  abstract topic: KAFKA_TOPIC;
  abstract groupId: string;
  private readonly kafkaClient: Kafka;

  abstract callback(value: T["data"]): Promise<void>;

  constructor(kafkaClient: Kafka) {
    this.kafkaClient = kafkaClient;
  }

  async consume() {
    try {
      const consumer = this.kafkaClient.consumer({ groupId: this.groupId });
      await consumer.connect();
      await consumer.subscribe({ topic: this.topic, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if (message.value) {
            const value = message.value.toString();
            console.log("Kafka consumer called by ::::: " + topic);
            this.callback(JSON.parse(value));
          }
        },
      });
    } catch (error) {
      console.log("Error on kafka Consumer", error);
    }
  }
}
