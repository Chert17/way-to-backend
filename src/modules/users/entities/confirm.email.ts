import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'confirm_emails' })
export class ConfirmEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  is_confirmed: boolean;

  @Column({ type: 'uuid', unique: true })
  confirm_code: string;

  @Column({ type: 'date' })
  expr_date: Date;

  @OneToOne(() => User, user => user.confirmEmail)
  user: User;
}
