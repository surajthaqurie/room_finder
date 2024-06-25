import { Module, Provider } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PrismaModule } from "src/utils";
import { PostCreateProducer } from "./post.producer";
import { KafkaService } from "src/utils/kafka/kafka.service";

const PostCreateProducerFactory: Provider = {
    provide: PostCreateProducer,
    useFactory: (kafkaService: KafkaService) => {
        return new PostCreateProducer(kafkaService.kafkaClient());
    },
    inject: [KafkaService]
};

@Module({
    imports: [PrismaModule],
    controllers: [PostController],
    providers: [PostService, PostCreateProducerFactory]
})
export class PostModule {}
