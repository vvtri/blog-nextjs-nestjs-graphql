import { InputType } from '@nestjs/graphql';
import {
  IsValidNumber,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';

@InputType()
export class PaginationCommentInput extends PaginationBaseInput {
  @IsValidText({ required: false })
  searchText?: string;

  @IsValidNumber({ min: 1, required: false })
  postId?: number;

  @IsValidNumber({ min: 1, required: false })
  userId?: number;
}

@InputType()
export class CreateCommentInput {
  @IsValidText()
  content: string;

  @IsValidNumber({ min: 1 })
  postId: number;
}
