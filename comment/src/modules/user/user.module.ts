import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schema";
import { UserService } from "./user.service";
import { UserCreateConsumer } from "./user.consumer";
import { KafkaService } from "src/utils/kafka/kafka.service";

const CommentCreateUserFactory: Provider = {
    provide: UserCreateConsumer,
    useFactory: (kafkaService: KafkaService, userService: UserService) => {
        return new UserCreateConsumer(kafkaService.kafkaClient(), userService);
    },
    inject: [KafkaService, UserService]
};

@Module({
    imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
    controllers: [],
    providers: [CommentCreateUserFactory, UserService],
    exports: [UserService]
})
export class UserModule {}
