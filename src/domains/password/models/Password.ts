import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import { User } from '@domains/user/models/User'

@Entity('passwords')
export class Password {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  value: string

  @ManyToOne(() => User, user => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
