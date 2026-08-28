import { Request, Response } from 'express';
import { transactionService } from './service';

export const transactionsController = {
  getAll: async (req: Request, res: Response) => res.json(await transactionService.getAll(requireUserId(req))),
  getById: async (req: Request, res: Response) => {
    const data = await transactionService.getById(req.params.id, requireUserId(req));
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  },
  create: async (req: Request, res: Response) => res.status(201).json(await transactionService.create({ ...req.body, user_id: requireUserId(req) })),
  update: async (req: Request, res: Response) => res.json(await transactionService.update(req.params.id, requireUserId(req), { ...req.body, user_id: requireUserId(req) })),
  delete: async (req: Request, res: Response) => { await transactionService.delete(req.params.id, requireUserId(req)); res.status(204).send(); },
};

function requireUserId(req: Request): string {
  const userId = req.header('x-user-id');
  if (!userId) throw new Error('x-user-id is required');
  return userId;
}
