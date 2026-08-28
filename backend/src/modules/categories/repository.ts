import { AppDataSource } from '../../db';
import { Category } from './entity';

const repo = () => AppDataSource.getRepository(Category);

export const categoryRepository = {
  getAll: async (userId: string) => await repo().findBy({ user_id: userId }),
  getById: async (id: string, userId: string) => await repo().findOneBy({ id, user_id: userId }),
  create: async (data: Partial<Category>) => { const entity = repo().create(data as Category); return await repo().save(entity); },
  update: async (id: string, userId: string, data: Partial<Category>) => { await repo().update({ id, user_id: userId }, data); return await repo().findOneBy({ id, user_id: userId }); },
  delete: async (id: string, userId: string) => { await repo().delete({ id, user_id: userId }); },
};
