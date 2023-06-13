import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'users_confirm_email' })
export class ConfirmEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  is_confirmed: boolean;

  @Column({ type: 'uuid', unique: true, default: null, nullable: true })
  confirm_code: string;

  @Column({ type: 'date', default: null, nullable: true })
  expr_date: Date;

  @OneToOne(() => User, user => user.confirmEmail)
  user: User;
}
