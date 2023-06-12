import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ type: 'string', length: 10, unique: true })
  login: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  pass_hash: string;

  @OneToOne(() => ConfirmEmail, confirmEmail => confirmEmail.user)
  @JoinColumn()
  confirmEmail: ConfirmEmail;

  @OneToOne(() => RecoveryPassword, recoveryPassword => recoveryPassword.user)
  @JoinColumn()
  recoveryPassword: RecoveryPassword;

  @OneToOne(() => BanUser, banUser => banUser.user)
  @JoinColumn()
  banUser: BanUser;

  @OneToOne(() => Device, device => device.user)
  @JoinColumn()
  device: Device;
}
