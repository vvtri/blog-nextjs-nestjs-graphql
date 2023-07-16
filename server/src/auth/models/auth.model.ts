import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenModel {
  accessToken: string;
  refreshToken?: string;

  static forAll(params: AuthTokenModel) {
    const { accessToken, refreshToken } = params;

    const result = new AuthTokenModel();

    result.accessToken = accessToken;
    result.refreshToken = refreshToken;

    return result;
  }
}
