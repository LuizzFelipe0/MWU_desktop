import { Request, Response } from 'express';
import { categoryService } from './service';

export const categoriesController = {
  getAll: async (req: Request, res: Response) => res.json(await categoryService.getAll(requireUserId(req))),
  getById: async (req: Request, res: Response) => {
    const data = await categoryService.getById(req.params.id, requireUserId(req));
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  },
  create: async (req: Request, res: Response) => {
    try {
      return res.status(201).json(await categoryService.create({ ...req.body, user_id: requireUserId(req) }));
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      return res.json(await categoryService.update(req.params.id, requireUserId(req), { ...req.body, user_id: requireUserId(req) }));
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  },
  delete: async (req: Request, res: Response) => { await categoryService.delete(req.params.id, requireUserId(req)); res.status(204).send(); },
};

function requireUserId(req: Request): string {
  const userId = req.header('x-user-id');
  if (!userId) throw new Error('x-user-id is required');
  return userId;
}
