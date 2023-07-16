import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../auth/models/user.model';
import { FileModel } from '../../file/dtos/models/file.model';
import { Post } from '../entities/post.entity';

export type PostModelParams = {
  data?: Post;
};

@ObjectType()
export class PostModel {
  id: number;
  title: string;
  content: string;
  userId: number;
  user: UserModel;

  static mapProperty(dto: PostModel, params: PostModelParams) {
    const { data } = params;

    dto.id = data.id;
    dto.content = data.content;
    dto.userId = data.userId;
  }

  static forUser(params: PostModelParams) {
    const { data } = params;

    const result = new PostModel();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }
}
