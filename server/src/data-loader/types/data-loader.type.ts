import DataLoader from 'dataloader';
import { User } from '../../auth/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { PaginationCommentModel } from '../../comment/models/pagination-comment.model';
import { PaginationBaseInput } from '../../common/inputs/base-pagination.input';
import { File } from '../../file/entities/file.entity';
import { Post } from '../../post/entities/post.entity';

export type IDataLoaders = {
  userLoader: DataLoader<number, User>;
  fileLoader: DataLoader<number, File>;
};
