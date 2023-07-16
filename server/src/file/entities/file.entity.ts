import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
@ObjectType()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @OneToOne(() => User, (u) => u.avatar)
  userAvatar?: User;

  // Join user
  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.files)
  @JoinColumn()
  user: User;
  // end join user
}
