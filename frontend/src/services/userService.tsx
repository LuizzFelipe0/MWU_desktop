import { User, UserInput } from '../types/userTypes.ts';
import { BaseService } from '../hooks/useApi.tsx';
import { mwu_api } from '../api.ts';

export const userService: BaseService<User, UserInput> = {
  getAll: async () => [],
  getById: async (id: string) => {
    const response = await mwu_api.get(`/users/${id}`);
    return response.data;
  },
  create: async (data: UserInput) => {
    const response = await mwu_api.post('/users/create', data);
    return response.data;
  },
  update: async (id: string, data: UserInput) => {
    const response = await mwu_api.patch(`/users/${id}/update`, data);
    return response.data;
  },
  delete: async () => undefined,
};
