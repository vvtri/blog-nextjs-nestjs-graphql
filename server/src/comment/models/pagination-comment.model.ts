import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../auth/models/user.model';
import { PaginationResult } from '../../common/models/base-pagination.model';
import { FileModel } from '../../file/dtos/models/file.model';
import { Comment } from '../entities/comment.entity';
import { PostModel } from './comment.model';

@ObjectType()
export class PaginationCommentModel extends PaginationResult(PostModel) {}
