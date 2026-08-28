import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'category_types' })
export class CategoryType {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;

  @Column('boolean', { default: false })
  is_positive!: boolean;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = randomUUID();
  }
}
