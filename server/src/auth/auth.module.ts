import { Module } from '@nestjs/common';
import { CommentModule } from '../comment/comment.module';
import { FileModule } from '../file/file.module';
import { FileRepository } from '../file/repositories/file.repository';
import { PostModule } from '../post/post.module';
import { TypeOrmCustomModule } from '../typeorm-custom/typeorm-custom.module';
import { JwtAuthenUserGuard } from './guards/jwt-authen-user.guard';
import { UserRepository } from './repositories/user.repository';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtAuthenUserStrategy } from './strategies/jwt-authen.strategy';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([UserRepository, FileRepository]),
    FileModule,
    PostModule,
    CommentModule,
  ],
  providers: [
    JwtAuthenUserStrategy,
    JwtAuthenUserGuard,

    AuthResolver,
    UserResolver,

    AuthService,
    UserService,
  ],
  exports: [UserService],
})
export class AuthModule {}
