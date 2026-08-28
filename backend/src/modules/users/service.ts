import { User } from './entity';
import { userRepository } from './repository';

export const userService = {
  getById: (id: string) => userRepository.getById(id),
  getByEmail: (email: string) => userRepository.getByEmail(email.trim().toLowerCase()),
  create: async (data: Partial<User>) => {
    const email = data.email?.trim().toLowerCase();
    if (!email || !data.password || !data.first_name || !data.last_name || !data.cpf) {
      throw new Error('Required user fields are missing');
    }

    if (await userRepository.getByEmail(email)) {
      throw new Error('Email already exists');
    }

    return userRepository.create({ ...data, email });
  },
  update: (id: string, data: Partial<User>) => userRepository.update(id, data),
};
