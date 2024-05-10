import { Global, Module } from "@nestjs/common";
import { KafkaService } from "./kafka.service";
import { BaseAdminTopic } from "./baseKafkaAdmin";
import { BaseConsumer } from "./baseConsumer";
import { BaseProducer } from "./baseProducer";

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [KafkaService],
    exports: [KafkaService]
})
export class KafkaModule {}
