import { InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaginationBaseInput {
  page?: number = 1;
  limit?: number = 10;
}
