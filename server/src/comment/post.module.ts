import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from '../typeorm-custom/typeorm-custom.module';
import { PostRepository } from './repositories/post.repository';
import { PostResolver } from './resolvers/post.resolver';
import { PostService } from './services/post.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([PostRepository])],
  providers: [PostResolver, PostService],
})
export class PostModule {}
