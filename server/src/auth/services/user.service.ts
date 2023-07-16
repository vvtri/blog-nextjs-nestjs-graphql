import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CommentService } from '../../comment/services/comment.service';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';
import { FileRepository } from '../../file/repositories/file.repository';
import { FileService } from '../../file/services/file.service';
import { Post } from '../../post/entities/post.entity';
import { PostService } from '../../post/services/post.service';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../inputs/user.input';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private fileService: FileService,
    private postService: PostService,
    private commentService: CommentService,

    private userRepo: UserRepository,
    private fileRepo: FileRepository,
  ) {}

  @Transactional()
  getMyInfo(user: User) {
    return user;
  }

  @Transactional()
  async updateUser(input: UpdateUserInput, user: User) {
    const { avatar, name } = input;

    if (avatar) {
      const file = await this.fileService.uploadFile(await avatar, user.id);
      user.avatarId = file.id;
    }

    if (name !== undefined) {
      user.name = name;
    }

    await this.userRepo.save(user);

    return user;
  }

  @Transactional()
  async getAvatarByUser(user: User) {
    if (!user.avatarId) return null;

    const file = await this.fileRepo.findOneBy({ id: user.avatarId });

    return file;
  }

  @Transactional()
  async paginationPosts(input: PaginationBaseInput, user: User) {
    const result = await this.postService.getList({
      ...input,
      userId: user.id,
    });

    return result;
  }

  @Transactional()
  async paginationComments(input: PaginationBaseInput, user: User) {
    const result = await this.commentService.getList({
      ...input,
      userId: user.id,
    });

    return result;
  }

  @Transactional()
  async getUserFromIds(userIds: readonly number[]) {
    const users = await this.userRepo
      .createQueryBuilder('u')
      .where('u.id IN (:...userIds)', {
        userIds,
      })
      .getMany();

    const mapUserIdToUsers: Record<number, User> = {};

    for (const user of users) {
      mapUserIdToUsers[user.id] = user;
    }

    return userIds.map((item) => mapUserIdToUsers[item]);
  }
}
