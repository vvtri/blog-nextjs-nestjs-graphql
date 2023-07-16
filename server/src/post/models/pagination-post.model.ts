import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../../auth/models/user.model';
import { PaginationResult } from '../../common/models/base-pagination.model';
import { FileModel } from '../../file/dtos/models/file.model';
import { Post } from '../entities/post.entity';
import { PostModel } from './post.model';

@ObjectType()
export class PaginationPostModel extends PaginationResult(PostModel) {}
