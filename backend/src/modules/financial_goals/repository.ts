import { AppDataSource } from '../../db';
import { FinancialGoal } from './entity';

const repo = () => AppDataSource.getRepository(FinancialGoal);

export const financialGoalRepository = {
  getAll: async (userId: string) => await repo().findBy({ user_id: userId }),
  getById: async (id: string, userId: string) => await repo().findOneBy({ id, user_id: userId }),
  create: async (data: Partial<FinancialGoal>) => { const entity = repo().create(data as FinancialGoal); return await repo().save(entity); },
  update: async (id: string, userId: string, data: Partial<FinancialGoal>) => { await repo().update({ id, user_id: userId }, data); return await repo().findOneBy({ id, user_id: userId }); },
  delete: async (id: string, userId: string) => { await repo().delete({ id, user_id: userId }); },
};
