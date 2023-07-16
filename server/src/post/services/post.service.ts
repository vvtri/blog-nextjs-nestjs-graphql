import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional';
import { User } from '../../auth/entities/user.entity';
import { UserRepository } from '../../auth/repositories/user.repository';
import { PaginationCommentInput } from '../../comment/inputs/comment.input';
import { CommentRepository } from '../../comment/repositories/post.repository';
import { CommentService } from '../../comment/services/comment.service';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';
import { Post } from '../entities/post.entity';
import { CreatePostInput, PaginationPostInput } from '../inputs/post.input';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    private commentService: CommentService,

    private postRepo: PostRepository,
    private userRepo: UserRepository,
    private commentRepo: CommentRepository,
  ) {}

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

    return post;
  }

  @Transactional()
  async create(input: CreatePostInput, user: User) {
    const { content, title } = input;

    const post = this.postRepo.create({ title, content, user });
    await this.postRepo.save(post);

    return post;
  }

  async getUser(post: Post) {
    if (!post.userId) return null;

    return this.userRepo.findOneBy({ id: post.userId });
  }

  async paginationComment(input: PaginationBaseInput, post: Post) {
    return this.commentService.getList({ ...input, postId: post.id });
  }
}
