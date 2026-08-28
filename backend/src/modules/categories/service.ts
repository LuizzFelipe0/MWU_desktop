import { categoryRepository } from './repository';
import { Category } from './entity';
import { AppDataSource } from '../../db';
import { CategoryType } from '../category_types/entity';

const validateCategoryType = async (categoryTypeId: unknown) => {
  if (typeof categoryTypeId !== 'string' || !categoryTypeId.trim()) {
    throw new Error('category_type_id is required');
  }

  const categoryType = await AppDataSource.getRepository(CategoryType).findOneBy({
    id: categoryTypeId,
  });

  if (!categoryType) {
    throw new Error('Invalid category_type_id');
  }
};

export const categoryService = {
  getAll: async (userId: string): Promise<Category[]> => categoryRepository.getAll(userId),
  getById: async (id: string, userId: string) => categoryRepository.getById(id, userId),
  create: async (data: Partial<Category>) => {
    await validateCategoryType(data.category_type_id);
    return categoryRepository.create(data);
  },
  update: async (id: string, userId: string, data: Partial<Category>) => {
    await validateCategoryType(data.category_type_id);
    return categoryRepository.update(id, userId, data);
  },
  delete: async (id: string, userId: string) => categoryRepository.delete(id, userId),
};
