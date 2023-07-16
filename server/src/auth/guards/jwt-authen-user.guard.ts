import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { StrategyName } from '../../common/constants/auth.constant';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthenUserGuard extends AuthGuard(
  StrategyName.JWT_AUTHEN_USER,
) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'auth.common.invalidToken',
      });
    }
    return user;
  }

  getRequest<T = any>(context: ExecutionContext): T {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
}
