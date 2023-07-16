import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../common/decorators/auth.decorator';
import { Comment } from '../entities/comment.entity';
import {
  CreateCommentInput,
  PaginationCommentInput,
} from '../inputs/comment.input';
import { PaginationCommentModel } from '../models/pagination-comment.model';
import { CommentService } from '../services/comment.service';

@Resolver(() => Comment)
@AuthenticateUser()
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query(() => PaginationCommentModel)
  paginationComment(@Args('input') input: PaginationCommentInput) {
    return this.commentService.getList(input);
  }

  @Query(() => Comment)
  comment(@Args('id') id: number) {
    return this.commentService.getDetail(id);
  }

  @Mutation(() => Comment)
  createComment(
    @Args('input') input: CreateCommentInput,
    @CurrentAuthData() user: User,
  ) {
    return this.commentService.create(input, user);
  }

  @ResolveField(() => User)
  user(@Parent() comment: Comment) {
    return this.commentService.getUser(comment);
  }
}
