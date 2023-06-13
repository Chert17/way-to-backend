import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BanUser } from './ban.user';
import { ConfirmEmail } from './confirm.email';
import { Device } from './devices';
import { RecoveryPassword } from './recovery.pass';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  login: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  pass_hash: string;

  @Column({ type: 'date' })
  created_at: string;

  @OneToOne(() => ConfirmEmail, confirmEmail => confirmEmail.user)
  @JoinColumn({ name: 'confirm_email_id' })
  confirmEmail: ConfirmEmail;

  @OneToOne(() => RecoveryPassword, recoveryPassword => recoveryPassword.user)
  @JoinColumn({ name: 'recovery_password_id' })
  recoveryPassword: RecoveryPassword;

  @OneToOne(() => BanUser, banUser => banUser.user)
  @JoinColumn({ name: 'ban_info_id' })
  banUser: BanUser;

  @OneToMany(() => Device, device => device.user)
  devices: Device[];
}
