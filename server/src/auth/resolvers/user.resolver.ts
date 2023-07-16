import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationCommentModel } from '../../comment/models/pagination-comment.model';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../common/decorators/auth.decorator';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';
import { GraphqlContext } from '../../common/types/graphql.type';
import { File } from '../../file/entities/file.entity';
import { Post } from '../../post/entities/post.entity';
import { PaginationPostModel } from '../../post/models/pagination-post.model';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../inputs/user.input';
import { UserService } from '../services/user.service';

@Resolver(() => User)
@AuthenticateUser()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  getMyInfo(@CurrentAuthData() user: User) {
    return this.userService.getMyInfo(user);
  }

  @Mutation(() => User)
  updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentAuthData() user: User,
  ) {
    return this.userService.updateUser(input, user);
  }

  @ResolveField('avatar', () => File, { nullable: true })
  avatar(@Parent() user: User, @Context() { loaders }: GraphqlContext) {
    const { fileLoader } = loaders;
    return user.avatarId ? fileLoader.load(user.avatarId) : null;
  }

  @ResolveField(() => PaginationPostModel, { name: 'paginationPosts' })
  async paginationPosts(
    @Args('input') input: PaginationBaseInput,
    @Parent() user: User,
  ) {
    return this.userService.paginationPosts(input, user);
  }

  @ResolveField(() => PaginationCommentModel, { name: 'paginationComments' })
  async paginationComments(
    @Args('input') input: PaginationBaseInput,
    @Parent() user: User,
  ) {
    return this.userService.paginationComments(input, user);
  }
}
