import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { FileModel } from '../../file/dtos/models/file.model';
import { FileRepository } from '../../file/repositories/file.repository';
import { FileService } from '../../file/services/file.service';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../inputs/user.input';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private fileService: FileService,

    private userRepo: UserRepository,
    private fileRepo: FileRepository,
  ) {}

  @Transactional()
  getMyInfo(user: User) {
    const res = UserModel.forMe({ data: user });
    return res;
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

    return UserModel.forMe({ data: user });
  }

  @Transactional()
  async getAvatarByUser(user: User) {
    const file = await this.fileRepo.findOneBy({ id: user.avatarId });

    return FileModel.forUser({ data: file });
  }
}
