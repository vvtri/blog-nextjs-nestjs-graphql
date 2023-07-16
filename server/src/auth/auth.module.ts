import { Module } from '@nestjs/common';
import { FileModel } from '../file/dtos/models/file.model';
import { FileModule } from '../file/file.module';
import { FileRepository } from '../file/repositories/file.repository';
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
  ],
  providers: [
    JwtAuthenUserStrategy,
    JwtAuthenUserGuard,

    AuthResolver,
    UserResolver,

    AuthService,
    UserService,
  ],
  exports: [],
})
export class AuthModule {}
