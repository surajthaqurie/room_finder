import { Consumer, Kafka, Message, Partitioners, Producer } from "kafkajs";

export class KafkaConfig {
  private producer: Producer;
  private consumer: Consumer;

  constructor(groupId: string) {
    const kafka = new Kafka({
      clientId: "auth-client",
      brokers: ["localhost:9093", "localhost:9095", "localhost:9097"],
      connectionTimeout: 30000,
      requestTimeout: 600000, // Increase the timeout value (in milliseconds)
      retry: {
        initialRetryTime: 600000, // Initial retry delay (in milliseconds)
        retries: 8, // Maximum number of retries
      },
    });

    this.producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    this.consumer = kafka.consumer({ groupId });
  }

  async produce(topic: string, messages: Message[]) {
    try {
      await this.producer.connect();

      await this.producer.send({ topic, messages });
      console.log("Kafka producer called by ::::: " + topic);
    } catch (error) {
      console.log("Error on kafka producer", error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic: string, callback: Function) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString();
          console.log("Kafka consumer called by ::::: " + topic);
          callback(value);
        },
      });
    } catch (error) {
      console.log("Error on kafka Consumer", error);
    }
    /*  finally {
      await this.consumer.disconnect();
    } 
    */
  }
}
