import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from 'src/utils';

@Module({
    imports: [PrismaModule],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule {}
