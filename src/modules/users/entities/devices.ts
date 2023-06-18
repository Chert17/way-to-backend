import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_devices' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  device_id: string;

  @Column({ type: 'varchar', length: 100 })
  ip: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar' })
  last_active_date: string;

  @ManyToOne(() => User, user => user.devices, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
