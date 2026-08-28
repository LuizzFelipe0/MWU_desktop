import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  user_id!: string;

  @Column('text', { nullable: true })
  account_id!: string | null;

  @Column('text')
  category_id!: string;

  @Column('text', { nullable: true })
  recurrence_id!: string | null;

  @Column('text')
  name!: string;

  @Column('text', { nullable: true })
  description!: string | null;

  @Column('real')
  amount!: number;

  @Column('text')
  date!: string;

  @Column('text', { nullable: true })
  recurrence_interval!: string | null;

  @Column('text', { nullable: true })
  next_due_date!: string | null;

  @Column('text', { nullable: true })
  end_date!: string | null;

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
