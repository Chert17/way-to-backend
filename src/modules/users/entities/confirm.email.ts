import { Column, Entity, OneToOne } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'confirm_emails' })
export class ConfirmEmail {
  @Column({ type: 'boolean', default: false })
  is_confirmed: boolean;

  @Column({ type: 'string', unique: true })
  confirm_code: string;

  @Column({ type: 'date' })
  expr_date: Date;

  @OneToOne(() => User, user => user.confirmEmail)
  user: User;
}
