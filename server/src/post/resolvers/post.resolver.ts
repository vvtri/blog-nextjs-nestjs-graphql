import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { CurrentAuthData } from '../../common/decorators/auth.decorator';
import { Post } from '../entities/post.entity';
import { CreatePostInput, PaginationPostInput } from '../inputs/post.input';
import { PaginationPostModel } from '../models/pagination-post.model';
import { PostModel } from '../models/post.model';
import { PostService } from '../services/post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => PaginationPostModel)
  paginationPost(@Args('input') input: PaginationPostInput) {
    return this.postService.getList(input);
  }

  @Query(() => PostModel)
  post(@Args('id') id: number) {
    return this.postService.getDetail(id);
  }

  @Mutation(() => PostModel)
  createPost(
    @Args('input') input: CreatePostInput,
    @CurrentAuthData() user: User,
  ) {
    return this.postService.create(input, user);
  }
}
