import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { commentSchema } from "./schema";
import { PostSchema } from "../post/schema";
import { PostModule } from "../post/post.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Comment", schema: commentSchema },
            { name: "Post", schema: PostSchema }
        ]),
        PostModule
    ],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule {}
