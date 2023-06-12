import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'recovery_passwords' })
export class RecoveryPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  is_confirmed: boolean;

  @Column({ type: 'uuid', unique: true })
  recovery_code: string;

  @Column({ type: 'date' })
  expr_date: Date;

  @OneToOne(() => User, user => user.recoveryPassword)
  user: User;
}
