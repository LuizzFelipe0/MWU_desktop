import { Request, Response } from 'express';
import { accountService } from './service';

export const accountsController = {
  getAll: async (req: Request, res: Response) => res.json(await accountService.getAll(requireUserId(req))),
  getById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await accountService.getById(id, requireUserId(req));
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  },
  create: async (req: Request, res: Response) => res.status(201).json(await accountService.create({ ...req.body, user_id: requireUserId(req) })),
  update: async (req: Request, res: Response) => res.json(await accountService.update(req.params.id, requireUserId(req), req.body)),
  delete: async (req: Request, res: Response) => { await accountService.delete(req.params.id, requireUserId(req)); res.status(204).send(); },
};

function requireUserId(req: Request): string {
  const userId = req.header('x-user-id');
  if (!userId) throw new Error('x-user-id is required');
  return userId;
}
