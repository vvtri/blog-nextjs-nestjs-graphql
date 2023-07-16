import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../../auth/entities/user.entity';
import { UserRepository } from '../../auth/repositories/user.repository';
import { PostRepository } from '../../post/repositories/post.repository';
import { Comment } from '../entities/comment.entity';
import {
  CreateCommentInput,
  PaginationCommentInput,
} from '../inputs/comment.input';
import { CommentRepository } from '../repositories/post.repository';

@Injectable()
export class CommentService {
  constructor(
    private commentRepo: CommentRepository,
    private postRepo: PostRepository,
    private userRepo: UserRepository,
  ) {}

  async getList(input: PaginationCommentInput) {
    const { limit, page, postId, userId } = input;
    let { searchText } = input;

    const qb = this.commentRepo.createQueryBuilder('c').groupBy('c.id');

    if (searchText) {
      searchText = `%${searchText}%`;
      qb.where('c.title ILIKE :searchText', { searchText });
    }

    if (postId) {
      qb.innerJoin('c.post', 'p').andWhere('p.id = :postId', { postId });
    }

    if (userId) {
      qb.innerJoin('c.user', 'u').andWhere('u.id = :userId', { userId });
    }

    const { items, meta } = await paginate(qb, { page, limit });

    return new Pagination(items, meta);
  }

  async getDetail(id: number) {
    const post = await this.commentRepo.findOneByOrThrowNotFoundExc({ id });

    return post;
  }

  async create(input: CreateCommentInput, user: User) {
    const { content, postId } = input;

    const post = this.commentRepo.create({ content, user, postId });
    await this.commentRepo.save(post);

    return post;
  }

  async getUser(comment: Comment) {
    const user = this.userRepo.findOneBy({ id: comment.userId });

    return user;
  }

  async getPost(comment: Comment) {
    const post = this.postRepo.findOneBy({ id: comment.postId });

    return post;
  }

  async getByPostIds(postIds: readonly number[]) {
    const comments = await this.commentRepo
      .createQueryBuilder('c')
      .where('c.postId IN (:...postIds)', { postIds })
      .getMany();

    const mapPostIdToComments: Record<number, Comment[]> = {};

    for (const comment of comments) {
      if (!mapPostIdToComments[comment.postId])
        mapPostIdToComments[comment.postId] = [];
      mapPostIdToComments[comment.postId].push(comment);
    }

    return postIds.map((item) => mapPostIdToComments[item]);
  }
}
