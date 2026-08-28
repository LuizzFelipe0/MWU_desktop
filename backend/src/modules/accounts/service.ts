import { accountRepository } from './repository';
import { Account } from './entity';

export const accountService = {
  getAll: async (userId: string): Promise<Account[]> => accountRepository.getAll(userId),
  getById: async (id: string, userId: string) => accountRepository.getById(id, userId),
  create: async (data: Partial<Account>) => accountRepository.create(data),
  update: async (id: string, userId: string, data: Partial<Account>) => accountRepository.update(id, userId, data),
  delete: async (id: string, userId: string) => accountRepository.delete(id, userId),
};
