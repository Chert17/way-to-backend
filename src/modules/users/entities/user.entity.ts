import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CreateUserFormat } from '../types/user.types';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 10 })
  login: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email: string;

  @Column({ type: 'text', unique: true })
  pass_hash: string;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'enum', enum: CreateUserFormat })
  format: CreateUserFormat;
}
