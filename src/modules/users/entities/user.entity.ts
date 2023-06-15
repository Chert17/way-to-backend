import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 10 })
  login: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', unique: true })
  pass_hash: string;

  @Column({ type: 'timestamp' })
  created_at: string;
}
