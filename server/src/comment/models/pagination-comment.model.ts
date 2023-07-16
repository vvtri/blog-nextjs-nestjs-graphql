import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsValidNumber } from '../../common/decorators/custom-validator.decorator';
import { PaginationResult } from '../../common/models/base-pagination.model';
import { Comment } from '../entities/comment.entity';

@ObjectType()
export class PaginationCommentModel extends PaginationResult(Comment) {}
