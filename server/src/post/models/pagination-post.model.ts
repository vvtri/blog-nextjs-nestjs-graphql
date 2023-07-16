import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginationResult } from '../../common/models/base-pagination.model';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PaginationPostModel extends PaginationResult(Post) {}
