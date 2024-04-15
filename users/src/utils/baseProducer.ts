import { Kafka, Message, Partitioners, Producer } from "kafkajs";
import { KAFKA_TOPIC } from "src/common/enum";

export abstract class BaseProducer<T extends { data: Message[] }> {
  abstract topic: KAFKA_TOPIC;
  abstract data: T["data"];

  private readonly producer: Producer;

  constructor(kafkaClient: Kafka) {
    this.producer = kafkaClient.producer({ createPartitioner: Partitioners.LegacyPartitioner });
  }

  async produce() {
    try {
      await this.producer.connect();

      await this.producer.send({ topic: this.topic, messages: this.data });
      console.log("Kafka producer called by ::::: " + this.topic);
    } catch (error) {
      console.log("Error on kafka producer", error);
    } finally {
      await this.producer.disconnect();
    }
  }
}
