import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaService {
    private kafka: Kafka;

    constructor(readonly configService: ConfigService) {
        this.kafka = new Kafka({
            // logLevel: logLevel.ERROR,
            clientId: "comment-service",
            brokers: this.configService.get("KAFKA_HOST").split(","),
            connectionTimeout: 30000,
            requestTimeout: 600000, // Increase the timeout value (in milliseconds)
            retry: {
                initialRetryTime: 600000, // Initial retry delay (in milliseconds)
                retries: 8 // Maximum number of retries
            }
        });
    }

    kafkaClient() {
        return this.kafka;
    }
}
