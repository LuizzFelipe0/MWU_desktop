import { Request, Response } from 'express';
import { userService } from './service';

export const userController = {
  create: async (req: Request, res: Response) => {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json(toSession(user));
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  },
  getById: async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(toSession(user));
  },
  update: async (req: Request, res: Response) => {
    try {
      const user = await userService.update(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json(toSession(user));
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  },
};

function toSession(user: NonNullable<Awaited<ReturnType<typeof userService.getById>>>) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    cpf: user.cpf,
    manual_balance: user.manual_balance,
    is_admin: false,
  };
}
