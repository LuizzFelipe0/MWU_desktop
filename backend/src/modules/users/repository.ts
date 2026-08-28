import { AppDataSource } from '../../db';
import { User } from './entity';

const repository = () => AppDataSource.getRepository(User);

export const userRepository = {
  getById: async (id: string) => repository().findOneBy({ id }),
  getByEmail: async (email: string) => repository().findOneBy({ email }),
  create: async (data: Partial<User>) => repository().save(repository().create(data)),
  update: async (id: string, data: Partial<User>) => {
    await repository().update({ id }, data);
    return repository().findOneBy({ id });
  },
};
