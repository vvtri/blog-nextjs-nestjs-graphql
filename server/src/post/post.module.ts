import { Module } from '@nestjs/common';
import { UserRepository } from '../auth/repositories/user.repository';
import { CommentModule } from '../comment/comment.module';
import { CommentRepository } from '../comment/repositories/post.repository';
import { TypeOrmCustomModule } from '../typeorm-custom/typeorm-custom.module';
import { PostRepository } from './repositories/post.repository';
import { PostResolver } from './resolvers/post.resolver';
import { PostService } from './services/post.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      PostRepository,
      UserRepository,
      CommentRepository,
    ]),
    CommentModule,
  ],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
