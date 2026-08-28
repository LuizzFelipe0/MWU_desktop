import { transactionRepository } from './repository';
import { Transaction } from './entity';

export const transactionService = {
  getAll: async (userId: string): Promise<Transaction[]> => transactionRepository.getAll(userId),
  getById: async (id: string, userId: string) => transactionRepository.getById(id, userId),
  create: async (data: Partial<Transaction>) => transactionRepository.create(data),
  update: async (id: string, userId: string, data: Partial<Transaction>) => transactionRepository.update(id, userId, data),
  delete: async (id: string, userId: string) => transactionRepository.delete(id, userId),
};
