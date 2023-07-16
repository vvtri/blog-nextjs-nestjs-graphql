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

@Entity()
export class Post {
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
  comments: Comment[];
}
