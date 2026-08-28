import { LoginInput, LoginOutput } from '../types/userTypes.ts';
import { mwu_api } from '../api.ts';

export const authService = {
  login: async (data: LoginInput): Promise<LoginOutput> => {
    const response = await mwu_api.post('/auth/login', data);
    return response.data;
  },
};
