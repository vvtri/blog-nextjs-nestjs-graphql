import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { CurrentAuthData } from '../../common/decorators/auth.decorator';
import { Comment } from '../entities/comment.entity';
import { CreatePostInput, PaginationPostInput } from '../inputs/comment.input';
import { PaginationPostModel } from '../models/pagination-comment.model';
import { PostModel } from '../models/comment.model';
import { PostService } from '../services/post.service';

@Resolver(() => Comment)
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
