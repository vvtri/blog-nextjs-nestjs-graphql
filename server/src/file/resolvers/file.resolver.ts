import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { GraphqlContext } from '../../common/types/graphql.type';
import { File } from '../entities/file.entity';

@Resolver(() => File)
export class FileResolver {
  @ResolveField(() => User)
  user(@Parent() file: File, @Context() { loaders }: GraphqlContext) {
    const { userLoader } = loaders;

    return userLoader.load(file.userId);
  }
}
