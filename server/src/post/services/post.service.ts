import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../../auth/entities/user.entity';
import { CreatePostInput, PaginationPostInput } from '../inputs/post.input';
import { PostModel } from '../models/post.model';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private postRepo: PostRepository) {}

  async getList(input: PaginationPostInput) {
    const { limit, page } = input;
    let { searchText } = input;

    const qb = this.postRepo.createQueryBuilder('p');

    if (searchText) {
      searchText = `%${searchText}%`;
      qb.where('p.title ILIKE :searchText', { searchText });
    }

    const { items, meta } = await paginate(qb, { page, limit });

    return new Pagination(items, meta);
  }

  async getDetail(id: number) {
    const post = await this.postRepo.findOneByOrThrowNotFoundExc({ id });

    return PostModel.forUser({ data: post });
  }

  async create(input: CreatePostInput, user: User) {
    const { content, title } = input;

    const post = this.postRepo.create({ title, content, user });
    await this.postRepo.save(post);

    return PostModel.forUser({ data: post });
  }
}
