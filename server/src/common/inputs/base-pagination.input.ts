import { InputType, ObjectType } from '@nestjs/graphql';

export abstract class PaginationBaseInput {
  page?: number = 10;
  limit?: number = 10;
}
