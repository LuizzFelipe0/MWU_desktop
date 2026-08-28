import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { nullable: true })
  user_id!: string | null;

  @Column('text')
  name!: string;

  @Column('text')
  account_number!: string;

  @Column('text')
  type!: string;

  @Column('real', { default: 0 })
  balance!: number;

  @CreateDateColumn({ type: 'text' })
  created_at!: string;

  @UpdateDateColumn({ type: 'text' })
  updated_at!: string;

  @Column('text', { nullable: true })
  deleted_at!: string | null;

  @BeforeInsert()
  setId() {
    this.id = randomUUID();
  }
}
