import { ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // Join user
  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.comments)
  @JoinColumn()
  user: User;
  // end join user

  // Join post
  @Column()
  postId: number;

  @ManyToOne(() => Post, (p) => p.comments)
  @JoinColumn()
  post: Post;
  // end join post
}
