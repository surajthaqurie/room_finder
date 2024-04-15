import { Kafka } from "kafkajs";
import { KAFKA_TOPIC } from "src/common/enum";

export abstract class BaseAdminTopic {
  abstract topic: KAFKA_TOPIC;
  private readonly kafkaClient: Kafka;

  constructor(kafkaClient: Kafka) {
    this.kafkaClient = kafkaClient;
  }

  async createTopicIfNotExits(numPartitions: number) {
    try {
      const admin = this.kafkaClient.admin();
      admin.connect();

      const topicExists = await admin.listTopics();
      if (!topicExists.includes(this.topic)) {
        await admin.createTopics({
          topics: [
            {
              topic: this.topic,
              numPartitions,
            },
          ],
        });
        console.log("Topic was created::", this.topic);
      }
    } catch (error) {
      console.log("Error on kafka admin", error);
    }
  }
}
