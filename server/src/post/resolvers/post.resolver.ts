import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { PaginationCommentInput } from '../../comment/inputs/comment.input';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../common/decorators/auth.decorator';
import { Post } from '../entities/post.entity';
import { CreatePostInput, PaginationPostInput } from '../inputs/post.input';
import { PaginationPostModel } from '../models/pagination-post.model';
import { PostService } from '../services/post.service';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';
import { PaginationCommentModel } from '../../comment/models/pagination-comment.model';
import { GraphqlContext } from '../../common/types/graphql.type';

@Resolver(() => Post)
@AuthenticateUser()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => PaginationPostModel)
  paginationPost(@Args('input') input: PaginationPostInput) {
    return this.postService.getList(input);
  }

  @Query(() => Post)
  post(@Args('id') id: number) {
    return this.postService.getDetail(id);
  }

  @Mutation(() => Post)
  createPost(
    @Args('input') input: CreatePostInput,
    @CurrentAuthData() user: User,
  ) {
    return this.postService.create(input, user);
  }

  @ResolveField()
  async user(@Parent() post: Post, @Context() ctx: GraphqlContext) {
    const { loaders } = ctx;
    const { userId } = post;

    return loaders.userLoader.load(userId);
  }

  @ResolveField(() => PaginationCommentModel, { name: 'paginationComments' })
  async paginationComments(
    @Args('input') paginationInput: PaginationBaseInput,
    @Parent() post: Post,
  ) {
    return this.postService.paginationComment(paginationInput, post);
  }
}
