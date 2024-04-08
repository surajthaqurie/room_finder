import { Kafka } from "kafkajs";
import { env } from "src/configs";

export const kafkaClient = new Kafka({
  clientId: "auth-service",
  brokers: env.kafkaConfig.KAFKA_BROKER_ID.split(","),
  requestTimeout: 3000, // Increase the timeout value (in milliseconds)
  retry: {
    initialRetryTime: 100, // Initial retry delay (in milliseconds)
    retries: 25, // Maximum number of retries
  },
});
