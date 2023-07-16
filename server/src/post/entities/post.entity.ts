import { HideField, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { PaginationCommentModel } from '../../comment/models/pagination-comment.model';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  // Join user
  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.posts)
  @JoinColumn()
  user: User;
  // end join user

  @OneToMany(() => Comment, (c) => c.post)
  @HideField()
  comments: Comment[];
}
