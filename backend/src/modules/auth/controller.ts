import { Request, Response } from 'express';
import { userService } from '../users/service';

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.getByEmail(email ?? '');

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        cpf: user.cpf,
        manual_balance: user.manual_balance,
        is_admin: false,
      },
    });
  },
};
