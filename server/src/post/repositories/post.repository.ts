import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(dataSource: DataSource) {
    super(Post, dataSource);
  }
}
