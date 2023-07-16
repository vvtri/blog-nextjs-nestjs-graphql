import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  AuthenticateUser,
  CurrentAuthData,
} from '../../common/decorators/auth.decorator';
import { FileModel } from '../../file/dtos/models/file.model';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../inputs/user.input';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@Resolver(() => UserModel)
@AuthenticateUser()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserModel)
  getMyInfo(@CurrentAuthData() user: User) {
    return this.userService.getMyInfo(user);
  }

  @Mutation(() => UserModel)
  updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentAuthData() user: User,
  ) {
    return this.userService.updateUser(input, user);
  }

  @ResolveField('avatar', () => FileModel)
  async getAvatarByUser(@Parent() user: User) {
    return this.userService.getAvatarByUser(user);
  }
}
