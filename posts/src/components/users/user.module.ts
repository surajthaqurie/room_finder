import { Module, Provider } from "@nestjs/common";
import { UserCreateConsumer } from "./user.consumer";
import { UserService } from "./user.service";
import { KafkaModule, PrismaModule } from "src/utils";
import { KafkaService } from "src/utils/kafka/kafka.service";

const PostUserCreateConsumerFactory: Provider = {
    provide: UserCreateConsumer,
    useFactory: (kafkaService: KafkaService, userService: UserService) => {
        return new UserCreateConsumer(kafkaService.kafkaClient(), userService);
    },
    inject: [KafkaService, UserService]
};

@Module({
    imports: [PrismaModule],
    providers: [
        PostUserCreateConsumerFactory,
        UserService
        // UserProducer,
    ]
})
export class UserModule {}
