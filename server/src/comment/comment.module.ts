import { Module } from '@nestjs/common';
import { UserRepository } from '../auth/repositories/user.repository';
import { PostRepository } from '../post/repositories/post.repository';
import { TypeOrmCustomModule } from '../typeorm-custom/typeorm-custom.module';
import { CommentRepository } from './repositories/post.repository';
import { CommentResolver } from './resolvers/comment.resolver';
import { CommentService } from './services/comment.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      CommentRepository,
      PostRepository,
      UserRepository,
    ]),
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
