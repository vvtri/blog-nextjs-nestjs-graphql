import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { BaseEntity } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  email: string;

  @Column({})
  password: string;

  @Column({ nullable: true })
  name: string;

  // join avatar
  @Column({ nullable: true })
  avatarId: number;

  @OneToOne(() => File, (f) => f.userAvatar)
  @JoinColumn()
  avatar?: File;
  // end join avatar

  @OneToMany(() => File, (f) => f.user)
  files: File[];

  @OneToMany(() => Post, (p) => p.user)
  posts: Post[];

  @OneToMany(() => Comment, c => c.user)
  comments: Comment[]
}
