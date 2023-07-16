import { Injectable } from '@nestjs/common';
import { UserService } from '../../auth/services/user.service';
import DataLoader from 'dataloader';
import { User } from '../../auth/entities/user.entity';
import { IDataLoaders } from '../types/data-loader.type';
import { CommentService } from '../../comment/services/comment.service';
import { Comment } from '../../comment/entities/comment.entity';
import { PaginationCommentModel } from '../../comment/models/pagination-comment.model';
import { FileService } from '../../file/services/file.service';
import { File } from '../../file/entities/file.entity';

@Injectable()
export class DataLoaderService {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  getLoaders(): IDataLoaders {
    const userLoader = new DataLoader<number, User>((userIds) =>
      this.userService.getUserFromIds(userIds),
    );
    const fileLoader = new DataLoader<number, File>((fileIds) =>
      this.fileService.getByIds(fileIds),
    );

    return { userLoader, fileLoader };
  }
}
