import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  user_id!: string;

  @Column('text')
  category_type_id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  description!: string;

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
