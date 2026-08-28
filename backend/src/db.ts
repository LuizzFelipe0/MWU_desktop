import { DataSource } from 'typeorm';
import path from 'path';
import { Account } from './modules/accounts/entity';
import { Category } from './modules/categories/entity';
import { FinancialGoal } from './modules/financial_goals/entity';
import { Transaction } from './modules/transactions/entity';
import { CategoryType } from './modules/category_types/entity';
import { User } from './modules/users/entity';

const dbFile = process.env.DB_PATH || path.resolve(__dirname, '..', 'data', 'mwu.db');

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbFile,
  synchronize: true,
  logging: false,
  entities: [User, Account, Category, CategoryType, FinancialGoal, Transaction],
});

export async function seedCategoryTypes() {
  const repository = AppDataSource.getRepository(CategoryType);

  await repository.upsert(
    [
      { id: '068165d71db874f4800051632b7e378e', name: 'Investimentos', is_positive: false },
      { id: '068165d8ef167fab800070d5357eb02f', name: 'Transferência', is_positive: false },
      { id: '068165de6ada762d8000a61e3c6959bd', name: 'Receita', is_positive: true },
      { id: '068165e04bde775380002faf9c6931ac', name: 'Despesa', is_positive: false },
    ],
    ['id'],
  );
}
