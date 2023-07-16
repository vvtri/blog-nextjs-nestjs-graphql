import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterInput, LoginInput } from '../inputs/auth.input';
import { AuthTokenModel } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthTokenModel)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthTokenModel)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }
}
