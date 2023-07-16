import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource);
  }
}
