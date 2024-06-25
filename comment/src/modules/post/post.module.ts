import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./schema";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: "Post", schema: PostSchema }]), UserModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}
