import { financialGoalRepository } from './repository';
import { FinancialGoal } from './entity';

export const financialGoalService = {
  getAll: async (userId: string): Promise<FinancialGoal[]> => financialGoalRepository.getAll(userId),
  getById: async (id: string, userId: string) => financialGoalRepository.getById(id, userId),
  create: async (data: Partial<FinancialGoal>) => financialGoalRepository.create(data),
  update: async (id: string, userId: string, data: Partial<FinancialGoal>) => financialGoalRepository.update(id, userId, data),
  delete: async (id: string, userId: string) => financialGoalRepository.delete(id, userId),
};
