import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { unique: true })
  email!: string;

  @Column('text')
  first_name!: string;

  @Column('text')
  last_name!: string;

  @Column('text')
  cpf!: string;

  @Column('text')
  password!: string;

  @Column('real', { default: 0 })
  manual_balance!: number;

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
