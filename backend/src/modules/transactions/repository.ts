import { AppDataSource } from '../../db';
import { Transaction } from './entity';

const repo = () => AppDataSource.getRepository(Transaction);

export const transactionRepository = {
  getAll: async (userId: string) => await repo().findBy({ user_id: userId }),
  getById: async (id: string, userId: string) => await repo().findOneBy({ id, user_id: userId }),
  create: async (data: Partial<Transaction>) => { const entity = repo().create(data as Transaction); return await repo().save(entity); },
  update: async (id: string, userId: string, data: Partial<Transaction>) => { await repo().update({ id, user_id: userId }, data); return await repo().findOneBy({ id, user_id: userId }); },
  delete: async (id: string, userId: string) => { await repo().delete({ id, user_id: userId }); },
};
