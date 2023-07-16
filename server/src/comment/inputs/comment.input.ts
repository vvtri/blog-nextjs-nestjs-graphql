import { InputType } from '@nestjs/graphql';
import { IsValidText } from '../../common/decorators/custom-validator.decorator';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';

@InputType()
export class PaginationCommentInput extends PaginationBaseInput {
  @IsValidText({ required: false })
  searchText?: string;
}

@InputType()
export class CreateCommentInput {
  @IsValidText()
  title: string;

  @IsValidText()
  content: string;
}
