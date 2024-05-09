import { Module, Provider } from "@nestjs/common";
import { UserCreateConsumer } from "./user.consumer";
import { UserService } from "./user.service";
import { UserProducer } from "./user.producer";
import { KafkaModule, PrismaModule } from "src/utils";
import { BaseAdminTopic } from "src/utils/kafka/baseKafkaAdmin";

// const AuthUserProducerFactory: Provider = {
//     provide: UserProducer,
//     useFactory: (kafkaService: KafkaService) => {
//         return new UserProducer(kafkaService.kafkaClient());
//     },
//     inject: [KafkaService]
// };

@Module({
    imports: [PrismaModule, KafkaModule],
    providers: [
        // AuthUserProducerFactory,
        UserCreateConsumer,
        UserService
        // UserProducer,
    ]
})
export class UserModule {}
