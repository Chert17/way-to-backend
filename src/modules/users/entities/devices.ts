import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_devices' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  device_id: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'date' })
  last_active_date: Date;

  @OneToOne(() => User, user => user.device)
  user: User;
}
