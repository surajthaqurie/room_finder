import { Kafka, Message, Partitioners, Producer } from "kafkajs";
import { KAFKA_TOPIC } from "src/utils/kafka/enums";

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

/* 
export abstract class BaseProducer {
  protected readonly producer: Producer;
  private logger: Logger;

  abstract topic: string;

  constructor(kafka: Kafka) {
    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    this.logger = new Logger();
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log('Error while connecting to kafka', error);
    }
  }

  async send<T>(payload: IMessagePayload<T>) {
    await this.connect();

    const { key, ...rest } = payload;

    await this.producer.send({
      topic: this.topic,
      messages: [{ key: key, value: JSON.stringify(rest) }],
    });
    this.logger.log(
      `🌟 New message for topic "${this.topic}" 📩: ${JSON.stringify(rest)} ✨`,
    );
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
*/
