import { Kafka } from "kafkajs";
import { env } from "src/configs";

export const kafkaClient = new Kafka({
  //   logLevel: logLevel.ERROR,
  clientId: "user-service",
  brokers: env.kafkaConfig.KAFKA_BROKER_ID.split(","),
  connectionTimeout: 30000,
  requestTimeout: 600000, // Increase the timeout value (in milliseconds)
  retry: {
    initialRetryTime: 600000, // Initial retry delay (in milliseconds)
    retries: 8, // Maximum number of retries
  },
});
