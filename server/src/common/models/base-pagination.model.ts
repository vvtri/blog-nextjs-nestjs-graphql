import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IPaginationLinks,
  IPaginationMeta,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Type } from '@nestjs/common';

@ObjectType()
export class PaginationLinksModel implements IPaginationLinks {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

@ObjectType()
export class PaginationMetaModel implements IPaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export function PaginationResult<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PageClass {
    @Field(() => [ItemType])
    items: T[];
    meta: PaginationMetaModel;
    links?: PaginationLinksModel;
  }

  return PageClass;
}
