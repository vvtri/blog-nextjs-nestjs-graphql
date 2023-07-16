import { ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../../auth/models/user.model';
import { File } from '../../entities/file.entity';

export type FileModelParams = {
  data?: File;
};

@ObjectType()
export class FileModel {
  id: number;
  url: string;
  mimetype: string;
  publicId: string;
  userId: number;
  user: UserModel;

  static mapProperty(model: FileModel, params: FileModelParams) {
    const { data } = params;

    model.id = data.id;
    model.url = data.url;
    model.mimetype = data.mimetype;
    model.userId = data.userId;
  }

  static forMe(params: FileModelParams) {
    const { data } = params;

    const result = new FileModel();
    if (!data) return null;

    this.mapProperty(result, params);

    result.publicId = data.publicId;

    return result;
  }

  static forUser(params: FileModelParams) {
    const { data } = params;

    const result = new FileModel();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }
}
