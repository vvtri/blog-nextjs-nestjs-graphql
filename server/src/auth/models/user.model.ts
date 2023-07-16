import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FileModel } from '../../file/dtos/models/file.model';
import { User } from '../entities/user.entity';

export type UserModelParams = {
  data?: User;
};

@ObjectType()
export class UserModel {
  id: number;
  email: string;
  avatarId?: number;
  avatar?: FileModel

  static mapProperty(dto: UserModel, params: UserModelParams) {
    const { data } = params;

    dto.id = data.id;
    dto.email = data.email;
    dto.avatarId = data.avatarId;
  }

  static forMe(params: UserModelParams) {
    const { data } = params;

    const result = new UserModel();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }

  static forUser(params: UserModelParams) {
    const { data } = params;

    const result = new UserModel();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }
}
