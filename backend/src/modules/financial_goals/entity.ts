import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'financial_goals' })
export class FinancialGoal {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  user_id!: string;

  @Column('text')
  name!: string;

  @Column('text', { nullable: true })
  description!: string | null;

  @Column('real')
  target_amount!: number;

  @Column('text')
  deadline!: string;

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
