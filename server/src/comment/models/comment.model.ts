import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { UserModel } from '../../auth/models/user.model';
import { FileModel } from '../../file/dtos/models/file.model';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../entities/comment.entity';

export type CommentModelParams = {
  data?: Comment;
};

@ObjectType()
export class PostModel {
  id: number;
  content: string;
  userId: number;
  user: UserModel;
  postId: number;
  post: PostModel;

  static mapProperty(dto: PostModel, params: CommentModelParams) {
    const { data } = params;

    dto.id = data.id;
    dto.content = data.content;
    dto.userId = data.userId;
  }

  static forUser(params: CommentModelParams) {
    const { data } = params;

    const result = new PostModel();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }
}
